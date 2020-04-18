'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var cors = require('cors');
var express = require('express');
var config = require('./config');
var app = express();
app.use(cors());

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

require('./config/express')(app);
require('./config/mongoose');
require('./config/redis');


console.log('App is running in', process.env.NODE_ENV, 'environment, on port number', config.port);

require('./config/error-handler')(app);


app.use('/', express.static('public'));
app.use('/', express.static('email-assets'));

/* Only for login */
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// catch 404 and forward to error handler
app.use(function (req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function (err, req, res, next) {
		logger.error("Something went wrong:", err);
		res.status(err.status || 500);
		res.send({
			message: err.message,
			error: err
		});
	});
}

// no stacktraces leaked to user
app.use(function (err, req, res, next) {
	logger.error("Something went wrong:", err);
	res.status(err.status || 500);
	res.send({
		message: err.message,
		error: {}
	});
});

app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE");
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, if-Match");
	next();
});

module.exports = app;
