'use strict';

var config = require('../../config/');
var sg = require('sendgrid')(config.sendgrid_api_key);
var fs = require('fs');
var ejs = require('ejs');

exports.sendRegistraionEmail = function sendRegistrationMail(username, emailId, token, verified) {
    var link = "http://" + config.serverURL + "/verify/" + token;
    var helper = require('sendgrid').mail;
    var fromEmail = new helper.Email('archanaannapureddy@gmail.com', 'Pointy-Haired-Boss');
    var toEmail = new helper.Email(emailId);
    var contentFs = fs.readFileSync('./public/htmls/registration.ejs', 'utf-8');

    var contentHtml = ejs.render(contentFs, {
        username: username,
        link: link,
        verified: verified
    });
    var subject = 'Pointy Haired Boss Registration';
    var content = new helper.Content('text/html', contentHtml);
    var mail = new helper.Mail(fromEmail, subject, toEmail, content);
    var request = sg.emptyRequest({
        method: 'POST',
        path: '/v3/mail/send',
        body: mail.toJSON()
    });

    sg.API(request, function (error, response) {
        if (error) {
            console.log('Error response received');
        }
        console.log(response.statusCode);
        console.log(response.body);
        console.log(response.headers);
    });
};


exports.sendTodoEmailToUser = function sendTodoEmailToUser(username, emailId) {
    var helper = require('sendgrid').mail;
    var fromEmail = new helper.Email('archanaannapureddy@gmail.com', 'Pointy-Haired-Boss');
    var toEmail = new helper.Email(emailId);
    var contentFs = fs.readFileSync('./public/htmls/todomail.ejs', 'utf-8');

    var contentHtml = ejs.render(contentFs, {
        username: username,
    });
    var subject = 'Pointy Haired Boss Assigned Task';
    var content = new helper.Content('text/html', contentHtml);
    var mail = new helper.Mail(fromEmail, subject, toEmail, content);
    var request = sg.emptyRequest({
        method: 'POST',
        path: '/v3/mail/send',
        body: mail.toJSON()
    });

    sg.API(request, function (error, response) {
        if (error) {
            console.log('Error response received');
        }
        console.log(response.statusCode);
        console.log(response.body);
        console.log(response.headers);
    });
};


exports.sendPasswordResetMail = function sendRegistrationMail(username, emailId, token) {
    var link = "http://" + config.serverURL + "/reset-password?code=" + token;
    var contentFs = fs.readFileSync('./public/htmls/reset-password.ejs', 'utf-8');
    var contentHtml = ejs.render(contentFs, {
        username: username,
        link: link
    });
    var helper = require('sendgrid').mail;
    var fromEmail = new helper.Email('archanaannapureddy@gmail.com', 'Pointy Haired Boss');
    var toEmail = new helper.Email(emailId);
    var subject = 'Reset Password request for Pointy Haired Boss';
    var content = new helper.Content('text/html', contentHtml);
    var mail = new helper.Mail(fromEmail, subject, toEmail, content);
    var request = sg.emptyRequest({
        method: 'POST',
        path: '/v3/mail/send',
        body: mail.toJSON()
    });

    sg.API(request, function (error, response) {
        if (error) {
            console.log('Error response received');
        }
        console.log(response.statusCode);
        console.log(response.body);
        console.log(response.headers);
    });
}
    
   
