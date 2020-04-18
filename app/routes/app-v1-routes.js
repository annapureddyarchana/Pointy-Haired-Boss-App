'use strict';

//Middleware goes here
var middlewares = require('../middlewares/authorization');
var headerMiddleware = require('../middlewares/validate-headers');


// Controller goes here
var userController = require('../contollers/user-controller');
var todoController = require('../contollers/todo-controller');

var app = require('express').Router();

app.get('/', function (req, res) {
    res.send("Pointy Haired Boss API")
});

// User API

app.post('/register', userController.registerUser);
// app.post('/login', userController.authenticate);
app.post('/login', userController.authenticateAdmin);
app.post('/logout', headerMiddleware.checkHeaders('all_headers'), middlewares.requiresLogin, userController.logout);
app.post('/reset-password', headerMiddleware.checkHeaders('all_headers'), middlewares.requiresLogin, userController.changePassword);
app.post('/forgot-password', userController.forgotPassword);
app.put('/user', headerMiddleware.checkHeaders('all_headers'), middlewares.requiresLogin, userController.updateProfile);
app.get('/me', headerMiddleware.checkHeaders('all_headers'), middlewares.requiresLogin, userController.getProfile);
app.post('/verification-email', userController.sendVerificationEmail);
app.get('/verify/:code', userController.verifyUser);

//Todo API's
app.post('/todos',headerMiddleware.checkHeaders('all_headers'), middlewares.requiresLogin,todoController.saveTodos);
app.get('/todos',headerMiddleware.checkHeaders('all_headers'), middlewares.requiresLogin,todoController.getAllTodosList);
app.get('/todos/:id',headerMiddleware.checkHeaders('all_headers'), middlewares.requiresLogin,todoController.getTodosDetails);
app.put('/todos/:id',headerMiddleware.checkHeaders('all_headers'), middlewares.requiresLogin,todoController.updateTodos);
app.delete('/todos/:id',headerMiddleware.checkHeaders('all_headers'), middlewares.requiresLogin,todoController.deleteTodos);


module.exports = app;
