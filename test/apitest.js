// let chai = require('chai');
// let chaiHttp = require('chai-http');
// var should = chai.should();
// chai.use(chaiHttp);
// let server = require('../app');
// var app = require('express').Router();
// var expect = require('chai').expect;
// let User = require('../app/models/user');
// var token;
// var url="http://localhost:3000/api/v1";





// chai.request('http://localhost:3000/api/v1')
//     .post('/login')
//     .send({"email": 'archanaannapureddy@gmail.com', "password": '123456'})
//     .end(function(err, res) {
//         // expect(err).to.be.null;
//          token = res.body.tokens; // Or something
//         console.log(token);
        
//         expect(res).to.have.status(200);
//     });


    //   describe('/GET Users', () => {
    //     it('it should GET all the users', (done) => {
    //       chai.request(url)
    //       .set('x-header-authtoken',"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiJiNWI4ZDNjY2VjZDU5NDk2NWNmNDg2ZDhlYTg3YzYyM2JiZmFjYjZiNDA2N2RhZDQiLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE1ODcxNDcyMDEsImV4cCI6MTU4NzIzMzYwMX0.cjArlHkcI7O-ttQiM38un864df6Bto2cSQ5tRaMQ7gI")
    //             .set('refreshtoken',"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiJiNWI4ZDNjY2VjZDU5NDk2NWNmNDg2ZDhlYTg3YzYyM2JiZmFjYjZiNDA2N2RhZDQiLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE1ODcxNDcyMDEsImV4cCI6MTU4NzQwNjQwMX0.MPs0T-ptaPLYCVx_DwUGR0Ml8AujkQks-3v0fK5PB5o")
    //             .set('Content-Type','application/json')
    //           .get('/users')
              
    //           .end((err, res) => {
    //                 res.should.have.status(200);
    //                 res.body.should.be.a('array');
    //                 res.body.length.should.be.eql(0);
    //             done();
    //           });
    //     });
    // });




//Our parent block
// describe('Users', () => {
//     describe('/GET users', () => {
//         it('it should GET all the users', (done) => {

            // chai.request('http://localhost:3000/api/v1')
            //     .set('x-header-authtoken',token.authToken)
            //     .set('refreshtoken',token.refreshToken)
            //     .set('Content-Type','application/json')
            //     .get('/users')
            //     .query()
            //     .end(function (err, res) {
            //         console.log(err);
            //         (res).should.have.status(200);
            //         (res.body).should.be.a('object');
            //         (res.body.podcasts.length).should.be.eql(1);
            //         done();
            //     });
//         });
//     });
// });
   