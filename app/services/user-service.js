'use strict'

var _ = require('lodash');
var async = require('async');
var moment = require('moment');
var Promise = require('bluebird');
// var uuid = require('node-uuid');
var uuid = require('uuid');

var User = require('../models/user');
var request = require('request');
var config = require('../../config/index');

var emailService = require('../services/email-service');
var ErrorService = require('../services/error-service.js');
var cryptoService = require('../services/crypto-service.js');


exports.register = function (userObj) {
    if (!userObj.email_confirmed) {
        userObj.verify_token = uuid.v4();
    }
    return User.findOne({ email: userObj.email }).exec()
        .then(function (user) {
            if (!user) {
                return User.create(userObj);
            }
            return Promise.reject(ErrorService.customError('EMAIL_EXISTS'));
        }).then(function (user) {
            if (userObj.email_confirmed) {
               emailService.sendRegistraionEmail(user.full_name, user.email, null, user.email_confirmed);
                return user;
            } else {
                var token = user.verify_token;
               emailService.sendRegistraionEmail(user.full_name, user.email, token, user.email_confirmed);
                return user;
            }
        })
};

// exports.authenticate = function (userDetails) {
//     return User.findOne({ email: userDetails.email }).exec().then(function (user) {
//         if (!user) {
//             return Promise.reject(ErrorService.customError('USER_NOT_FOUND'))
//         }
//         if (!user.email_confirmed) {
//             return Promise.reject(ErrorService.customError('UNVERIFIED_ACCOUNT'));
//         }
//         if (user.authenticate(userDetails.password)) {
//             return user.save();
//         } else {
//             return Promise.reject(ErrorService.customError('PASSWORD_MISMATCH'))
//         }
//     });
// };

exports.authenticateAdmin = function (userDetails) {
    return User.findOne({ email: userDetails.email,role:"ADMIN" }).exec().then(function (user) {
        if (!user) {
            return Promise.reject(ErrorService.customError('USER_NOT_FOUND'))
        }
        if (!user.email_confirmed) {
            return Promise.reject(ErrorService.customError('UNVERIFIED_ACCOUNT'));
        }
        if (user.authenticate(userDetails.password)) {
            return user.save();
        } else {
            return Promise.reject(ErrorService.customError('PASSWORD_MISMATCH'))
        }
    });
};

exports.getProfile = function (user) {
    return User.findOne(user);
};

exports.updateProfile = function (user, callback) {
    return User.findByIdAndUpdate(user._id, user, { new: true });
};

exports.logout = function (user_id) {
    if (user_id) {
        return User.findById(user_id).exec().then(function (user) {
            return user.save();
        });
    } else {
        return Promise.resolve({ result: true });
    }
};

exports.verifyUser = function (token) {
    return User.findOne({ verify_token: token }).then(function (user) {
        if (user) {
            user.verify_token = undefined;
            user.email_confirmed = true;
            return user.save()
        } else {
            return Promise.reject("Link expired");
        }
    })
};

exports.forgotPassword = function (email) {
    return User.findOne({ email: email }).then(function (user) {
        if (!user) {
            return Promise.reject(ErrorService.customError('INCORRECT_EMAIL'));
        } else if (!user.email_confirmed) {
            return Promise.reject(ErrorService.customError('UNVERIFIED_ACCOUNT'));
        } else {
            user.password_reset_token = uuid.v4();
            return user.save().then(function (user) {
                // emailService.sendPasswordResetMail(user.full_name, user.email, user.password_reset_token)
                return Promise.resolve();
            })
        }
    })
};

exports.getUser = function (user) {
    return User.findOne(user);
}

exports.getUserById = function (user) {
    return User.findById(user);
}
exports.getUsers =function(query){
    return User.find(query);
}

exports.resetPassword = function (code, newPassword) {
    if (!code) {
        return Promise.reject(ErrorService.customError('MISSING_PARAMS'))
    }
    return User.findOne({ password_reset_token: code })
        .then(function (user) {
            if (!user) {
                return Promise.reject(ErrorService.customError('USER_NOT_FOUND'))
            } else {
                user.password_reset_token = "";
                user.password = newPassword;
                return user.save();
            }
        })
};

exports.changePassword = function (userId, oldPassword, newPassword) {
    return User.findOne({ _id: userId })
        .then(function (user) {
            if (!user) {
                return Promise.reject(ErrorService.customError('USER_NOT_FOUND'))
            } else if (!user.authenticate(oldPassword)) {
                return Promise.reject(ErrorService.customError('PASSWORD_MISMATCH'))
            }
            else {
                user.password = newPassword;
                return user.save();
            }
        })
};




//encrypt users 
    exports.getAllUsers = function (req, res, next) {
        return User.find({}, ['full_name', 'email','date_of_birth','gender'])
            .then(function (users) {

                // console.log(users);
                var hash_string = cryptoService.encryptUsers(users);
                // console.log(hash_string);
                return res.status(200).send({
                    success: true,
                    result: hash_string
                });
            })
            .catch(function (err) {
                return res.status(400).send({
                    success: false,
                    message: err.message,
                    err: err
                });
            });
    };


