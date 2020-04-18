/**
 * Created by Archana on 17/4/2020.
 */

'use strict';

var Todo = require('../models/todo');
var ErrorService = require('../services/error-service.js');
var moment = require('moment');
var ObjectId = require('mongodb').ObjectID;

module.exports = {
    //get all Todos list
    getTodosList: function () {
        var query={"isDeleted":false};
        return Todo.find(query)
            .populate('createdBy','email full_name gender')
            .populate('assignedTo','email full_name gender')
            .sort({ createdAt: 1 })
            .then(function (result) {
                return result;
            })
            .catch(function (err) {
                return Promise.reject(err);
            });
    },
    saveTodos: function (data) {
        //to save Todo
        return Todo.create(data)
            .then(function (data) {
                return data;
            });
    },
    //update todo
    updateTodos:function(id,data){
        return Todo.findByIdAndUpdate(id, data, { new: true });
    },
    //get todo details
    getTodosDetails: function (id) {
        return Todo.findByIdAndUpdate(id) 
        .populate('createdBy','email full_name gender')
        .populate('assignedTo','email full_name gender')
      
    },
    //delete Todo
    deleteTodo: function (id, callback) {
        return Todo.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    },

};
