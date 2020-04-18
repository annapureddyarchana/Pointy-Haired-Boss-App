/**
 * Created by archana on 20/2/18.
 */

'use strict';

var moment = require('moment');

var TodoService = require('../services/todo-service');
var ErrorService = require('../services/error-service');
var UserService = require('../services/user-service');
var config = require('../../config/index');
var emailService = require('../services/email-service');



module.exports = {

    getAllTodosList: function (req, res, next) {
        TodoService.getTodosList({})
            .then(function (result) {
                res.send({
                    success: true,
                    result: result
                });
            })
            .catch(function (err) {
                ErrorService.error(err, req, res);
            });
    },

    saveTodos: function (req, res, next) {
        var data = req.body;
        var user = req.user;
        data.createdBy = user._id;
        // data.startDate = moment.utc(new Date(data.startDate)).format();
        var resObj = {};
        if (!data.title || !data.description || !data.status || !data.assignedTo) {
            ErrorService.error(ErrorService.customError('MISSING_PARAMS'), req, res);
            return;
        }

        var userObj = {
            _id: req.user._id
        };
        return Promise.all([
            TodoService.saveTodos(data),
            UserService.getUserById(data.assignedTo)
        ]).then(function (result) {
            var user = result[1];
            if(user){
            emailService.sendTodoEmailToUser(user.full_name, user.email);
            }
            return res.json({
                success: true,
                result: result[0]
            });
        })
            .catch(function (err) {
                ErrorService.error(err, req, res);
            });
        // return TodoService.saveTodos(data)
        //     .then(function (result) {
        //         res.send({
        //             success: true,
        //             result: result
        //         });
        //     })
        //     .catch(function (err) {
        //         ErrorService.error(err, req, res);
        //     });

    },
    updateTodos: function (req, res, next) {
        var data = req.body;
        var id = req.params.id;
        return TodoService.updateTodos(id, data)
            .then(function (result) {
                res.send({
                    success: true,
                    result: result
                });
            })
            .catch(function (err) {
                ErrorService.error(err, req, res);
            });
    },

    deleteTodos: function (req, res, next) {
        var data = req.body;
        var id = req.params.id;
        return TodoService.deleteTodo(id)
            .then(function (result) {
                res.send({
                    success: true,
                    result: result
                });
            })
            .catch(function (err) {
                ErrorService.error(err, req, res);
            });
    },


    //get Todo Details by id
    getTodosDetails: function (req, res, next) {
        var id = req.params.id;


        TodoService.getTodosDetails(id)
            .then(function (result) {
                var resObj = {
                    success: true,
                    result: result,
                };
                res.send(resObj);

            }).catch(function (err) {
                ErrorService.error(err, req, res);
            })


    },



}