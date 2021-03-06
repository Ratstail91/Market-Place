//environment variables
require('dotenv').config();

//libraries
const util = require('util');
const bcrypt = require('bcrypt');
const sendmail = require('sendmail')({silent: true});

//utilities
const { log } = require('../utilities/logging.js');
const { throttle, isThrottled } = require('../utilities/throttling.js');
const validateEmail = require('../utilities/validate_email.js');
const promisifyFormidable = require('../utilities/promisify_formidable.js');

const signupRequest = (connection) => (req, res) => {
	//handle all outcomes
	const handleRejection = (obj) => {
		res.status(400).write(log(obj.msg, obj.extra.toString()));
		res.end();
	}

	const handleSuccess = (obj) => {
		log(obj.msg, obj.extra.toString());
		res.status(200).json(obj);
		res.end();
	}

	return promisifyFormidable(req)
		.then(validateSignup(connection))
		.then(generateHash(connection))
		.then(sendSignupEmail())
		.then(handleSuccess)
		.catch(handleRejection)
	;
};

const validateSignup = (connection) => ({ fields }) => async (resolve, reject) => {
	//prevent too many clicks via throttle tool
	if (isThrottled(fields.email)) {
		return reject({ msg: 'Signup throttled', extra: [fields.email] });
	}

	throttle(fields.email);

	//validate email, username and password
	if (!validateEmail(fields.email) || fields.username.length < 4 || fields.username.length > 100 || fields.password.length < 8 || fields.password !== fields.retype) {
		return reject({msg: 'Invalid signup data', extra: [fields.email, fields.username]});
	}

	//check to see if the email has been banned
	const bannedQuery = 'SELECT COUNT(*) as total FROM bannedEmails WHERE email = ?;';
	const banned = await connection.query(bannedQuery, [fields.email])
		.then((results) => results[0].total > 0)
	;

	//if the email has been banned
	if (banned) {
		return reject({ msg: 'This email account has been banned!', extra: [fields.email] });
	}

	//check if email, username already exists
	const existsQuery = 'SELECT (SELECT COUNT(*) FROM accounts WHERE email = ?) AS email, (SELECT COUNT(*) FROM accounts WHERE username = ?) AS username;';
	const exists = await connection.query(existsQuery, [fields.email, fields.username])
		.then((results) => async (resolve, reject) => {
			results[0].email === 0 ? resolve(results) : reject('Email already registered!')
		})
		.then((results) => async (resolve, reject) => {
			results[0].username === 0 ? resolve(results) : reject('Username already registered!')
		})
		.catch(e => e)
	;

	if (typeof(exists) === 'string') {
		return reject({ msg: exists, extra: [fields.email, fields.username] });
	}

	//all went well
	return resolve(fields);
};

const generateHash = (connection) => (fields) => async (resolve, reject) => {
	const salt = await bcrypt.genSalt(11);
	const hash = await bcrypt.hash(fields.password, salt);

	//generate a random number as a token
	const rand = Math.floor(Math.random() * 2000000000); //2 billion

	//save the generated data to the signups table
	const signupQuery = 'REPLACE INTO signups (email, username, hash, promotions, verify) VALUES (?, ?, ?, ?, ?);';
	await connection.query(signupQuery, [fields.email, fields.username, hash, fields.promotions ? true : false, rand]);

	return resolve({ rand, fields });
};

const sendSignupEmail = () => ({ rand, fields }) => async (resolve, reject) => {
	const send = util.promisify(sendmail);

	const addr = `http://${process.env.WEB_ADDRESS}/verifyrequest?email=${fields.email}&verify=${rand}`
	const msg = 'Hello! Please visit the following address to verify your account: ';

	await send({
		from: `signup@${process.env.WEB_ADDRESS}`,
		to: fields.email,
		subject: 'Email Verification',
		text: msg + addr,
	})
		.then(
			() => resolve({ msg: 'Verification email sent!', extra: [fields.email, fields.username] }),
			() => reject({ msg: 'Something went wrong', extra: [fields.email, fields.username] })
		)
	;
};

module.exports = {
	//public API
	signupRequest
};