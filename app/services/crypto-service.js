'use strict';

var config = require('../../config/'),
    // Crypto Module
    crypto = require('crypto'),
   
    // Secret Keys
    cryptokey = config.CRYPTOKEY;
    var CryptoJS = require("crypto-js");

module.exports = {

    encrypt: function (payload) {
        var cipher = crypto.createCipher('aes-256-ctr', cryptokey)
        var crypted = cipher.update(payload.toString(), 'utf8', 'hex')
        crypted += cipher.final('hex');
        return crypted;
    },

    decrypt: function (text) {
        var decipher = crypto.createDecipher('aes-256-ctr', cryptokey)
        var dec = decipher.update(text, 'hex', 'utf8')
        dec += decipher.final('utf8');
        return dec;
    },
    encryptUsers:function(text){
       // Encrypt 
       var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(text), cryptokey);
      return ciphertext.toString();
    },
    // decryptUsers:function(text){
    //     var bytes  = CryptoJS.AES.decrypt(text, cryptokey);
    //     var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    //     return decryptedData;
    // }
}
