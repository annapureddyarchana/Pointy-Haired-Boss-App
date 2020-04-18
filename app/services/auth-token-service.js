
'use strict';

var jwt = require('jsonwebtoken');
var config = require('../../config');
var crypto = crypto = require('crypto');

var CryptoService = require('./crypto-service');
var redisClient = require('../../config/redis').redisClient;

exports.createToken = function (user) {
    //Create a Token and send the response
    var userDetails = {
        _id: CryptoService.encrypt(user._id),
        role: user.role
    };
    var token = jwt.sign(userDetails, config.jwtSecret, {
        expiresIn: config.authExpiry
    });
    // Token.create()
    return token;
};

exports.createRefreshToken = function (user) {
    //Create a Token and send the response
    var userDetails = {
        _id: CryptoService.encrypt(user._id),
        role: user.role
    };
    var refreshToken = jwt.sign(userDetails, config.jwtRefreshSecret, {
        expiresIn: config.refreshExpiry
    });
    // Token.create()
    return refreshToken;
};



exports.verifyToken = function (token) {
    return new Promise(function (resolve, reject) {
        jwt.verify(token, config.jwtSecret, function (err, decoded) {
            if (err) {
                return reject(err)
            }
            decoded._id = CryptoService.decrypt(decoded._id);
            return resolve(decoded);
        });
    })
}

exports.verifyRefreshToken = function (token) {
    return new Promise(function (resolve, reject) {
        jwt.verify(token, config.jwtRefreshSecret, function (err, decoded) {
            if (err) {
                return reject(err)
            }
            decoded._id = CryptoService.decrypt(decoded._id);
            return resolve(decoded);
        });
    })
}

exports.checkTokenInRedis = function (token) {
    return new Promise(function (resolve, reject) {
        redisClient.hget(token, "userId", function (err, value) {
            if (err) {
                return reject(err);
            }
            if (!value) {
                return reject(new Error("Please sign in"));
            }
            return resolve(value)
        });
    });
}

exports.deleteTokenFromRedis = function (token) {
    return new Promise(function (resolve, reject) {
        redisClient.del(token, function (err, status) {
            if (err) {
                return reject(err);
            }
            // if (status === 0) {
            //     return reject(new Error("Redis token absent"));
            // }
            return resolve(status)
        })
    });
}
