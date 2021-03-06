const formidable = require('formidable');

const promisifyFormidable = (req, opts) => {
	return new Promise((resolve, reject) => {
		var form = formidable.IncomingForm(opts);
		form.parse(req, (err, fields, files) => {
			if (err) return reject(err);
			return resolve({ fields: fields, files: files });
		});
	});
};

module.exports = promisifyFormidable;