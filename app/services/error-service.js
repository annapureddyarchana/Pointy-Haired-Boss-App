/**
 * Created by Archana on 18/4/2020.
 */

'use strict';

let errorMsgs = {
    'NOT_FOUND': 'Not found',
    'NOT_INVITED': 'You have not been invited, contact support.',
    'MISSING_PARAMS': 'Missing required parameters',
    'INVALID_EMAIL':'Invalid Email',
    'INTERNAL_SERVER_ERROR': 'Oops! Error occurred.',
    'VALIDATION_FAILED': 'Validations failed',
    'INVALID_GROUP_CODE': 'Invalid group code',
    'UNAUTHORISED': "Session expired, please re-login to continue using the app",
    'EMAIL_EXISTS': "User Exists With Same Email",
    'UNVERIFIED_ACCOUNT': "Please verify your account",
    "USER_NOT_FOUND": "User not found",
    "PASSWORD_MISMATCH": "Incorrect password",
    "INCORRECT_EMAIL": "Email id doesn't exist",
    "MISSING_HEADERS" : "Please give all the required headers",
    "NOTAUTHORIZED": 'Authorization failed',
    "VERIFIED_EMAIL": "Email already verified",
    "EMAIL_REQUIRED": "Email required"
};

let statusCode = {
    'NOT_FOUND': 400,
    'MISSING_PARAMS': 400,
    'INTERNAL_SERVER_ERROR': 500,
    'VALIDATION_FAILED': 400,
    'INVALID_GROUP_CODE': 400,
    'UNAUTHORISED': 401,
    'EMAIL_EXISTS': 401,
    'UNVERIFIED_ACCOUNT': 403,
    "USER_NOT_FOUND": 400,
    "PASSWORD_MISMATCH": 400,
    "INCORRECT_EMAIL": 400,
    "MISSING_HEADERS" : 400,
    "INVALID_TYPE": 400,
    "NOTAUTHORIZED": 401,
    "VERIFIED_EMAIL": 400
};

// var Raven = require('raven');

module.exports = {
    customError(errorType) {
        let msg = errorMsgs[errorType] || errorMsgs['INTERNAL_SERVER_ERROR'];
        let e = new Error(msg);
        e.status = statusCode[errorType] || 500;
        return e;
    },
    getErrorMsg(errorType) {
        return errorMsgs[errorType] || errorMsgs['INTERNAL_SERVER_ERROR'];
    },
    error(err, req, res) {
        let error = {
            status: err.status || 500,
            message: err.message || err.stack.split(/\s*\n\s*/, 2).join(' ') || ErrorService.getErrorMsg('INTERNAL_SERVER_ERROR')
        };
        console.log(`Error :: ${err}`);
        return res.status(error.status).json({ success: false, message: error.message });
    }
};
