'use strict';

var _ = require('lodash');
var async = require('async');
var moment = require('moment');
var fs = require('fs');
var config = require('../../config/index');

var UserService = require('../services/user-service');
var AuthTokenService = require('../services/auth-token-service');
var ErrorService = require('../services/error-service');

var redis = require('../../config/redis').redis;
var redisClient = require('../../config/redis').redisClient;
var emailService = require('../services/email-service');

exports.registerUser = function (req, res, next) {
    if (!req.body.email || !req.body.password || !req.body.full_name || !req.body.date_of_birth || !req.body.gender) {
        ErrorService.error(ErrorService.customError('MISSING_PARAMS'), req, res);
        return;
    }
    const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (req.body.email && !emailRegexp.test(req.body.email)) {
        ErrorService.error(ErrorService.customError('INVALID_EMAIL'), req, res);
        return;
    }
    var updateInvite = false;
    var _invite = {};
    var userObj = {
        "email": req.body.email.trim().toLowerCase(),
        "password": req.body.password,
        "full_name": req.body.full_name,
        "gender": req.body.gender.trim().toUpperCase(),
        "date_of_birth": req.body.date_of_birth
    };
    return UserService.register(userObj)
        .then(function (user) {
            //if (user.email_confirmed) {
            var tokens = {
                authToken: AuthTokenService.createToken(user),
                refreshToken: AuthTokenService.createRefreshToken(user)
            };
            //storing tokens in redis with "authToken" as key and [userId , refreshToken] as value
            redisClient.hmset(tokens.authToken, "userId", user._id.toString(), "refreshToken", tokens.refreshToken, redis.print);
            res.send({
                success: true,
                result: {
                    message: "Registered successfully",
                    tokens: tokens,
                    verified: user.email_confirmed,
                    
                }
            });
        }).catch(function (err) {
            console.log(err);
            err.status = 400;
            ErrorService.error(err, req, res);
        })
};

// exports.authenticate = function (req, res, next) {
//     var userObj = req.body;
//     if (!userObj.email || userObj.password == undefined) {
//         ErrorService.error(ErrorService.customError('MISSING_PARAMS'), req, res);
//         return;
//     }
//     userObj.email = userObj.email.trim().toLowerCase();
//     var resObj = {};
//     UserService.authenticate(userObj)
//         .then(function (user) {
//             resObj.result = {
//                 success: true,
//                 user: user
//             };
//             resObj.tokens = {
//                 authToken: AuthTokenService.createToken(user),
//                 refreshToken: AuthTokenService.createRefreshToken(user)
//             };

//             //storing tokens in redis with "authToken" as key and [userId , refreshToken] as value
//             redisClient.hmset(resObj.tokens.authToken, "userId", user._id.toString(), "refreshToken", resObj.tokens.refreshToken, redis.print);

//             resObj.user = {
//                 terms_of_use: user.terms_of_use
//             }

//             res.send(resObj);
//         }).catch(function (err) {
//             ErrorService.error(err, req, res);
//         })
// };

exports.authenticateAdmin = function (req, res, next) {
    var userObj = req.body;
    if (!userObj.email || userObj.password == undefined) {
        ErrorService.error(ErrorService.customError('MISSING_PARAMS'), req, res);
        return;
    }
    userObj.email = userObj.email.trim().toLowerCase();
    var resObj = {};
    UserService.authenticateAdmin(userObj)
        .then(function (user) {
            console.log(user);
            resObj.result = {
                success: true,
                user: user
            };
            resObj.tokens = {
                authToken: AuthTokenService.createToken(user),
                refreshToken: AuthTokenService.createRefreshToken(user)
            };
            console.log(resObj.tokens);

            //storing tokens in redis with "authToken" as key and [userId , refreshToken] as value
            redisClient.hmset(resObj.tokens.authToken, "userId", user._id.toString(), "refreshToken", resObj.tokens.refreshToken, redis.print);

            resObj.user = {
                terms_of_use: user.terms_of_use
            }

            res.send(resObj);
        }).catch(function (err) {
            ErrorService.error(err, req, res);
        })
};



exports.getProfile = function (req, res, next) {
    var userObj = {
        _id: req.user._id
    };
    UserService.getProfile(userObj)
        .then(function (user) {
            res.send({
                result: user
               
            });
        }).catch(function (err) {
            ErrorService.error(err, req, res);
        })
};

exports.updateProfile = function (req, res, next) {
    var userObj = req.body;
    userObj._id = req.user._id;

    UserService.updateProfile(userObj).then(function (user) {
        res.send({
            result: user
        });
    }).catch(function (err) {
        ErrorService.error(err, req, res);
    })
};

exports.logout = function (req, res, next) {
    var user_id = req.user._id;
    var device_token = req.body.device_token;
    UserService.logout(user_id, device_token).then(function (user) {
        redisClient.del(req.headers['x-header-authtoken'], function (err, status) {
            if (err) {
                ErrorService.error(err, req, res);
                return;
            }
            return res.send({
                success: true,
                result: {
                    success: "Logged out successfully"
                }
            });
        });
    }).catch(function (err) {
        ErrorService.error(err, req, res);
    })
};

exports.forgotPassword = function (req, res, next) {
    if (!req.body.email) {
        ErrorService.error(ErrorService.customError('MISSING_PARAMS'), req, res);
        return;
    }
    var email = req.body.email.trim().toLowerCase();

    UserService.forgotPassword(email).then(function () {
        return res.json({
            success: true,
            result: {
                success: "Email sent successfully"
            }
        });
    }).catch(function (err) {
        ErrorService.error(err, req, res);
    })
};

exports.verifyUser = function (req, res, next) {
    var token = req.params.code;
    if (token == undefined) {
        ErrorService.error(ErrorService.customError('MISSING_PARAMS'), req, res);
        return;
    }
    UserService.verifyUser(token).then(function (user) {
        if (user) {
            fs.readFile('./public/htmls/email-verified.html', function (err, html) {
                if (err) {
                    throw err;
                }
                res.writeHeader(200, {
                    "Content-Type": "text/html"
                });
                res.write(html);
                res.end();
            })
            // res.send("Email verified")
        } else {
            // res.send("Link expired");
            fs.readFile('./public/htmls/link-expired.html', function (err, html) {
                if (err) {
                    throw err;
                }
                res.writeHeader(400, {
                    "Content-Type": "text/html"
                });
                res.write(html);
                res.end();
            })
        }
    }).catch(function (err) {
        // res.send("Link expired");
        fs.readFile('./public/htmls/link-expired.html', function (err, html) {
            if (err) {
                throw err;
            }
            res.writeHeader(400, {
                "Content-Type": "text/html"
            });
            res.write(html);
            res.end();
        })
    })
};

exports.generateResetPage = function (req, res, next) {
    var code = req.query.code;
    if (code == undefined) {
        ErrorService.error(ErrorService.customError('MISSING_PARAMS'), req, res);
        return;
    }
    UserService.getUser({
        password_reset_token: code
    })
        .then(function (user) {
            if (user) {
                fs.readFile('public/htmls/addPassword.html', function (err, html) {
                    if (err) {
                        throw err;
                    }
                    res.writeHeader(200, {
                        "Content-Type": "text/html"
                    });
                    res.write(html);
                    res.end();
                })
            } else {
                fs.readFile('./public/htmls/link-expired.html', function (err, html) {
                    if (err) {
                        throw err;
                    }
                    res.writeHeader(400, {
                        "Content-Type": "text/html"
                    });
                    res.write(html);
                    res.end();
                })
            }
        }).catch(function (err) {
            fs.readFile('./public/htmls/link-expired.html', function (err, html) {
                if (err) {
                    throw err;
                }
                res.writeHeader(400, {
                    "Content-Type": "text/html"
                });
                res.write(html);
                res.end();
            })
        })

};

exports.resetPassword = function (req, res, next) {
    var resetCode = req.query.code;
    var newPassword = req.body.password;
    if (resetCode == undefined || !newPassword) {
        ErrorService.error(ErrorService.customError('MISSING_PARAMS'), req, res);
        return;
    }
    UserService.resetPassword(resetCode, newPassword)
        .then(function (user) {
            fs.readFile('./public/htmls/password-reset.html', function (err, html) {
                if (err) {
                    throw err;
                }
                res.writeHeader(200, {
                    "Content-Type": "text/html"
                });
                res.write(html);
                res.end();
            })
        }).catch(function (err) {
            console.log(err);
            return res.send("Something went wrong again");
        });
};

exports.changePassword = function (req, res, next) {
    var oldPassword = req.body.oldPassword;
    var newPassword = req.body.newPassword;
    if (!oldPassword || !newPassword) {
        ErrorService.error(ErrorService.customError('MISSING_PARAMS'), req, res);
        return;
    }
    UserService.changePassword(req.user._id, oldPassword, newPassword)
        .then(function () {
            return res.json({
                success: true,
                result: {
                    success: "Password changed successfully"
                }
            });
        }).catch(function (err) {
            ErrorService.error(err, req, res);
        });
};

exports.sendVerificationEmail = function (req, res, next) {

    if (!req.body.email) {
        ErrorService.error(ErrorService.customError('MISSING_PARAMS'), req, res);
        return;
    }
    var email = req.body.email.trim().toLowerCase();

    UserService.getUser({
        email: email
    })
        .then(function (userObj) {
            if (!userObj) throw ErrorService.customError('USER_NOT_FOUND');
            if (userObj.email_confirmed) throw ErrorService.customError('VERIFIED_EMAIL');
            emailService.sendRegistraionEmail(userObj.full_name, userObj.email, userObj.verify_token, userObj.email_confirmed);
            return res.json({
                success: true,
                result: "Email sent successfully, please verify"
            });
        })
        .catch(function (err) {
            ErrorService.error(err, req, res);
        });

};

exports.getUserByEmail = function (req, res, next) {
    if (!req.query.email) {
        ErrorService.error(ErrorService.customError('EMAIL_REQUIRED'), req, res);
        return;
    }
    var email = req.query.email.trim().toLowerCase();
    UserService.getUser({
        email: email
    })
        .then(function (userObj) {
            if (!userObj) throw ErrorService.customError('USER_NOT_FOUND');

            var responseObj = {
                email: userObj.email,
                name: userObj.full_name,
                dob: moment(userObj.date_of_birth).format('MM-DD-YYYY'),
                gender: userObj.gender
            }
            return res.status(200).send({
                success: true,
                result: responseObj
            });
        })
        .catch(function (err) {
            ErrorService.error(err, req, res);
        });
}
exports.getUsersList = function (req, res, next) {
    UserService.getUsers({ "role": "USER" })
        .then(function (result) {
            res.send({
                success: true,
                result: result
            });
        })
        .catch(function (err) {
            ErrorService.error(err, req, res);
        });
}


