'use strict';
var mung = require('express-mung');
/* Convert null json to empty document {} */
function redact(body, req, res) {
    if (res.tokens) {
        body.token = res.tokens;
    }
    return body;
}

module.exports = mung.json(redact);
