
var path = require('path');
var rootPath = path.normalize(__dirname + '/../..');

module.exports = {
    root: rootPath,
    port: process.env.PORT || 3000,
    db: process.env.MONGODB_URL || process.env.MONGOLAB_URI || process.env.MONGOHQ_URL,
    redis: process.env.REDIS_URL || process.env.REDIS_URI,
    jwtSecret: "supersecretkey",
    jwtRefreshSecret: "superRefreshsecretkey",
    refreshExpiry: '3d',
    authExpiry: '1d',
    serverURL: process.env.HOST,
    CRYPTOKEY: "supercryptosecretkey",
    // requiredHeaders: ['x-app-version'],
    requiredHeaders: [],
    
    additionalHeaders: ['x-header-authtoken', 'refreshtoken'],
    // admin: {
    //     user_name: process.env.ADMIN_USERNAME,
    //     password: process.env.ADMIN_PASSWORD
    // }
    
};
