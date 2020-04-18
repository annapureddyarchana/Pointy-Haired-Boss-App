'use strict'

/** Redis Datastore config **/
var redis = require('redis');

var config = require('./index.js');

var url = config.redis;
var redisClient = redis.createClient(url);

redisClient.on('error', function (err) {
    console.log('Error ' + err);
});

redisClient.on('connect', function () {
    console.log('Redis is ready');
});

exports.redis = redis;
exports.redisClient = redisClient;

// CONFIG SET protected-mode no
