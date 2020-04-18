'use strict';

var AuthService = require('../services/auth-token-service');
var ErrorService = require('../services/error-service');

var auth = require('basic-auth');
var config = require('../../config/');

var redis = require('../../config/redis').redis;
var redisClient = require('../../config/redis').redisClient;

var requiresLogin = function(req, res, next) {
    AuthService.checkTokenInRedis(req.headers['x-header-authtoken'])
        .then(function(redisdata) {
            return AuthService.verifyToken(req.headers['x-header-authtoken'])
        }).then(function(payload) {
            req.user = payload;
            return null;
        }).catch(function(err) {
            if (err.name === 'TokenExpiredError') {
                return AuthService.verifyRefreshToken(req.headers.refreshtoken)
            }
            throw err;
        }).then(function(payload) {
            if (!payload) {
                next();
            } else {
                req.user = payload;
                var tokens = {};
                tokens.authToken = AuthService.createToken(payload);
                tokens.refreshToken = AuthService.createRefreshToken(payload);

                //deleting old tokens from redis
                AuthService.deleteTokenFromRedis(req.headers['x-header-authtoken']);

                //storing tokens in redis with "authToken" as key and [userId , refreshToken] as value
                redisClient.hmset(tokens.authToken, "userId", req.user._id.toString(), "refreshToken", tokens.refreshToken, redis.print);

                res.tokens = tokens;
                next();
            }
        }).catch(function(err) {
            ErrorService.error(ErrorService.customError('UNAUTHORISED'), req, res);
        })

};




exports.requiresLogin = requiresLogin;
