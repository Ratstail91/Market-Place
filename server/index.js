//environment variables
require('dotenv').config();

//libraries
let express = require('express');
let app = express();
let http = require('http').Server(app);
let bodyParser = require('body-parser');
let path = require('path');

//utilities
let { log } = require('./utilities/logging.js');

app.use(bodyParser.json());

//database
let connectToDatabase = require('./utilities/database.js');
let connection = connectToDatabase(); //uses .env

//handle accounts
app.post('/signuprequest', require('./accounts/signup_request.js').signupRequest(connection));
//app.get('/verifyrequest', accounts.verifyRequest(connection));
//app.post('/loginrequest', accounts.loginRequest(connection));
//app.post('/logoutrequest', accounts.logoutRequest(connection));
//app.post('/passwordchangerequest', accounts.passwordChangeRequest(connection));
//app.post('/passwordrecoverrequest', accounts.passwordRecoverRequest(connection));
//app.post('/passwordresetrequest', accounts.passwordResetRequest(connection));
//app.post('/privacysettingsrequest', accounts.privacySettingsRequest(connection));
//app.post('/privacysettingsupdaterequest', accounts.privacySettingsUpdateRequest(connection));

//TODO: handle profiles

//static directories
app.use('/content', express.static(path.resolve(__dirname + '/../client/content')) );
app.use('/img', express.static(path.resolve(__dirname + '/../client/img')) );
app.use('/styles', express.static(path.resolve(__dirname + '/../client/styles')) );

//the app file(s)
app.get('/*app.bundle.js', (req, res) => {
	res.sendFile(path.resolve(`${__dirname}/../client/${req.originalUrl.split('/').pop()}`));
});

//source map (for development)
app.get('/app.bundle.js.map', (req, res) => {
	res.sendFile(path.resolve(__dirname + `/../client/${req.originalUrl}`));
});

//fallback to index.html
app.get('*', (req, res) => {
	res.sendFile(path.resolve(__dirname + '/../client/index.html'));
});

//startup
http.listen(4100, () => {
	log('listening to *:4100');
});
