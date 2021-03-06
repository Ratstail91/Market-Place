let exclusionList = require('./logging_exclusion_list.json');

const log = (msg, ...args) => {
	if (exclusionList.indexOf(msg) === -1) {
		let dateString = Date().replace(/\s\(.*\)/i, ''); //dumb formatting
		console.log(`log ${dateString}: ${msg} (${args.toString()})`);
	}
	return msg;
}

const logActivity = (connection, id) => {
	let query = 'UPDATE accounts SET lastActivityTime = CURRENT_TIMESTAMP() WHERE id = ?;';
	connection.query(query, [id], (err) => {
		if (err) throw err;
	});
};

module.exports = {
	log,
	logActivity
};