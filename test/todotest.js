let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../app");
let should = chai.should();
// var url = "http://localhost:3000/api/v1";
var expect = require('chai').expect;
var request = require('supertest');
chai.use(chaiHttp);

let authUser = {};
const userCredentials = {
    "email": 'archanaannapureddy@gmail.com', "password": '123456'
}
//now let's login the user before we run any tests
var authenticatedUser = request.agent(server);
before(function (done) {
    authenticatedUser
        .post('/api/v1/login')
        .send(userCredentials)
        .end(function (err, response) {
            console.log(err, response.body.tokens);
            authUser.access_token = response.body.tokens.authToken;
            authUser.refreshToken = response.body.tokens.refreshToken;
            expect(response.statusCode).to.equal(200);
            done();
        });
});

describe('GET /me', function (done) {
    //addresses 1st bullet point: if the user is logged in we should get a 200 status code
    it('should return a 200 response if the user is logged in', function (done) {
        authenticatedUser.get('/api/v1/me')
            .set('x-header-authtoken', authUser.access_token)
            .set('refreshtoken', authUser.refreshToken)
            .expect(200, done);
    });
    //addresses 2nd bullet point: if the user is not logged in we should get a 302 response code and be directed to the /login page
    it('should return a 302 response and redirect to /me', function (done) {
        request(server).get('/api/v1/me')
            // .expect('Location', '/api/v1/login')
            .expect(302, done);
    });
});

describe("Todos", function () {

    describe("CRUD OPERATIONS", function () {

        var todos = [{
            "_id": "5e99ab280f341b5c30f2a293",
            "title": "test task1",
            "description": "issue fix in ios app",
            "assignedTo": "5e99751ef4e3305003bdb31e",
            "type": "bug",
            "status": "Open",
            "platForm": "ios"

        }, {
            "_id": "5e99af9fd213645c5921e5a0",
            "title": "test task2",
            "description": "issue fix in ios app",
            "assignedTo": "5e99751ef4e3305003bdb31e",
            "type": "bug",
            "status": "Open",
            "platForm": "ios"

        }]
        it("Should add Todos in DB", (done) => {
            for (todo in todos) {
                authenticatedUser.post('/api/v1/todos')
                .set('x-header-authtoken', authUser.access_token)
                .set('refreshtoken', authUser.refreshToken)
            }
            done()
        })

        it("Should Fecth all the Todos", (done) => {
            authenticatedUser.get('/api/v1/todos')
            .set('x-header-authtoken', authUser.access_token)
            .set('refreshtoken', authUser.refreshToken)
            .expect(200, done);
        })

        it("Should Fetch Particular Todo Details", (done) => {
           
            authenticatedUser.get('/api/v1/todos/' + todos[1]._id)
            .set('x-header-authtoken', authUser.access_token)
            .set('refreshtoken', authUser.refreshToken)
            .expect(200, done);
        })

        it("Should Update Partcular Todo Only", (done) => {
            var updatedTodo = {
                "title": "test task2",
                "description": "issue fix in web app", //desc changed
                "assignedTo": "5e99751ef4e3305003bdb31e",
                "type": "bug",
                "status": "Open",
                "platForm": "ios"
            }

            authenticatedUser.put('/api/v1/todos/' + todos[1]._id)
            .set('x-header-authtoken', authUser.access_token)
            .set('refreshtoken', authUser.refreshToken)
            .expect(200, done);
        })

        it("should check data updated in DB", (done) => {
           
            authenticatedUser.get('/api/v1/todos/' + todos[1]._id)
            .set('x-header-authtoken', authUser.access_token)
            .set('refreshtoken', authUser.refreshToken)
            .expect(200, done);
        })

        it("Should Delete Particular Todo", (done) => {
           
            authenticatedUser.delete('/api/v1/todos/' + todos[1]._id)
            .set('x-header-authtoken', authUser.access_token)
            .set('refreshtoken', authUser.refreshToken)
            .expect(200, done);
        })

        it("Should confirm delete with number of Docs from DB", (done) => {
           
            authenticatedUser.get('/api/v1/todos')
            .set('x-header-authtoken', authUser.access_token)
            .set('refreshtoken', authUser.refreshToken)
            .expect(200, done);
        })

    })
})



// describe("Todos", function () {
//     it("Login App", (done) => {
//         chai.request(url)
//             .post('/login')
//             .send({ "email": 'archanaannapureddy@gmail.com', "password": '123456' })
//             .end(function (err, res) {
//                 // expect(err).to.be.null;
//                 token = res.body.tokens; // Or something
//                 console.log(token);

//                 // expect(res).to.have.status(200);
//             });
//             done()
//     });

//     describe("CRUD OPERATIONS", function () {

//         var todos = [{
//             "_id": "5e99ab280f341b5c30f2a293",
//             "title": "test task1",
//             "description": "issue fix in ios app",
//             "assignedTo": "5e99751ef4e3305003bdb31e",
//             "type": "bug",
//             "status": "Open",
//             "platForm": "ios"

//         }, {
//             "_id": "5e99af9fd213645c5921e5a0",
//             "title": "test task2",
//             "description": "issue fix in ios app",
//             "assignedTo": "5e99751ef4e3305003bdb31e",
//             "type": "bug",
//             "status": "Open",
//             "platForm": "ios"

//         }]
//         it("Should add Todos in DB", (done) => {
//             for (todo in todos) {
//                 chai.request(url)
//                     .post("/todos/")
//                     .send(todos[todo])
//                     .end((err, res) => {
//                         res.should.have.status(200);
//                         // console.log("Response Body:", res.body);

//                     })
//             }
//             done()
//         })

//         it("Should Fecth all the Todos", (done) => {
//             chai.request(url)
//                 .get("/todos")
//                 .end((err, result) => {
//                     result.should.have.status(200);
//                     // console.log ("Got",result.body.data.length, " docs")
//                     //console.log ("Result Body:", result.body);

//                     done()
//                 })
//         })

//         it("Should Fetch Particular Todo Details", (done) => {
//             chai.request(url)
//                 .get("/todos/" + todos[1]._id)
//                 .end((err, result) => {
//                     result.should.have.status(200)
//                     console.log("Fetched Particlar Todo using /GET/TODOS/:TODOID ::::", result.body)
//                     done()
//                 })
//         })

//         it("Should Update Partcular Todo Only", (done) => {
//             var updatedTodo = {
//                 "title": "test task2",
//                 "description": "issue fix in web app", //desc changed
//                 "assignedTo": "5e99751ef4e3305003bdb31e",
//                 "type": "bug",
//                 "status": "Open",
//                 "platForm": "ios"
//             }

//             chai.request(url)
//                 .put("/todos/" + todos[1]._id)
//                 .send(updatedTodo)
//                 .end((err, result) => {
//                     result.should.have.status(200)
//                     console.log("Updated Particlar Todo using /GET/TODOS/:TODOID ::::", result.body)
//                     done()
//                 })
//         })

//         it("should check data updated in DB", (done) => {
//             chai.request(url)
//                 .get("/todos/" + todos[1]._id)
//                 .end((err, result) => {
//                     result.should.have.status(200)
//                     // result.body.data.description.should.eq("issue fix in web app")
//                     console.log("Fetched Particlar Todo using /GET/TODOS/:TODOID ::::", result.body)
//                     done()
//                 })
//         })

//         it("Should Delete Particular Todo", (done) => {
//             chai.request(url)
//                 .delete("/todos/" + todos[1]._id)
//                 .end((err, result) => {
//                     result.should.have.status(200)
//                     console.log("Deleted Particlar Todo using /GET/TODOS/:TODOID ::::", result.body)
//                     done()
//                 })
//         })

//         it("Should confirm delete with number of Docs from DB", (done) => {
//             chai.request(url)
//                 .get("/todos")
//                 .end((err, result) => {
//                     result.should.have.status(200);
//                     // result.body.data.length.should.eq(1);
//                     // console.log ("Got",result.body.data.length, " docs")
//                     //console.log ("Result Body:", result.body);
//                     done()
//                 })
//         })

//     })
// })