'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TodoSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: { 
        type: String,
        required: true},
    assignedTo: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    type:{
        type: String,
        required: true
    },
    createdBy:{
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    platForm:{
        type: String,
        required: true
    },
    startDate:{
        type:Date
    },
    endDate:{
        type:Date
    },
    status: {
        type: String,
        required: true,
        enum: ["Open","In Progress","Closed"],
        index: true
      },
    isDeleted:{
        type:Boolean,
        default:false
    }

}, {
        timestamps: true
    });

module.exports = mongoose.model('Todo', TodoSchema);
