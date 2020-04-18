'use strict';

var crypto = require('crypto'),
    _ = require('lodash'),
    moment = require('moment'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var UserSchema = new Schema({
    full_name: {
        type: String,
        required: [true, 'User full name is required']
    },
    email: {
        type: String,
        validate: {
            validator: function (v) {
                return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v);
            },
            message: '{VALUE} is not a valid email address!'
        },
        required: [true, 'User email required'],
        lowercase: true
    },
    email_confirmed: {
        type: Boolean,
        default: true //setting it to true since an invite email is going.
    },
    role: {
        type: "String",
        default: "USER",
        enum: ['USER', 'ADMIN']
    },
    date_of_birth: {
        type: Date,
        required: [true, 'Date of birth is required']
    },
    hashed_password: {
        type: String,
        required: [true, 'Password is required']
    },
    gender: {
        type: String,
        enum: ['MALE', 'FEMALE'],
        required: [true, 'Gender is required']
    },
    salt: String,
    verify_token: String,
    password_reset_token: String
    
},
{
        timestamps: true
    });

UserSchema.options.toJSON = {
    transform: function (doc, ret, options) {
        ret.date_of_birth = moment(doc.date_of_birth).format("ll");
        delete ret.__v;
        delete ret.aws_picture_key;
        delete ret.t_and_c;
        delete ret.hashed_password;
        delete ret.salt;
        return ret;
    }
};

UserSchema.virtual('password').set(function (password) {
    this._password = String(password);
    this.salt = this.makeSalt();
    this.hashed_password = this.encryptPassword(this._password);
}).get(function () {
    return this._password;
});

UserSchema.methods = {
    authenticate: function (plainText) {
        return this.encryptPassword(plainText) === this.hashed_password;
    },

    makeSalt: function () {
        return crypto.randomBytes(16).toString('base64');
    },

    encryptPassword: function (password) {
        if (!password || !this.salt) return '';
        var salt = new Buffer(this.salt, 'base64');
        return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha1').toString('base64');
    },

};

UserSchema.pre('find', function () {
    if (this._conditions.email && typeof this._conditions.email === "string") this._conditions.email = (this._conditions.email).toLowerCase();
});

UserSchema.pre('findOne', function () {
    if (this._conditions.email && typeof this._conditions.email === "string") this._conditions.email = (this._conditions.email).toLowerCase();
});

module.exports = mongoose.model('User', UserSchema);
