var express = require('express'),
    bodyParser = require('body-parser'),
    mongoStore = require('connect-mongo'),
    cookieParser = require('cookie-parser'),
    config = require('./index'),
    _ = require('lodash'),
    fs = require('fs'),
    helmet = require('helmet'),
    logger = require('morgan'),
    url = require('url');

var path = require('path');
//Create a session middleware with the given options
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var config = require('./index');

var sessionOptions = {
    store: new MongoStore({
        url: config.db,
        ttl: 14 * 24 * 60 * 60 // = 14 days. Default
    }),
    key: 'auth_token',
    secret: "supersecrectcodeforsecureserver",
    // cookie: config.cookieOptions,
    proxy: true,
    name: 'sid',
    resave: true,
    saveUninitialized: true,
};

module.exports = function (app) {
    app.set('showStackError', true);
    app.use(helmet());
    // Prettify HTML
    app.locals.pretty = true;

    // Only use logger for development environment
    if (process.env.NODE_ENV === 'development') {
        app.use(logger('dev'));
    }

    // Set views path, template engine and default layout
    app.set('views', config.root + '/app/views');
    // view engine setup
    app.set('view engine', 'ejs');

    // Enable jsonp
    app.enable("jsonp callback");

    // The cookieParser should be above session
    app.use(cookieParser());
    // app.use(compression());

    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(session(sessionOptions));

    app.use(require('../app/middlewares/responseInterceptor.js'))

    // Load all the routes
    var appRoutes1 = require('../app/routes/app-v1-routes');
    app.use('/api/v1/', appRoutes1);
    // app.use('/', require('../app/routes/app-routes'));
};
