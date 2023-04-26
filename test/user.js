process.env.NODE_ENV = 'test';
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('./../app');
let User = require('./../models/User');

chai.should();
chai.use(chaiHttp);
describe('Users API', () => {

    beforeEach((done) => {
        User.deleteMany({}, (err) => {
            done();
        });
    });

    describe('GET /users', () => {
        it('It should return empty users', (done) => {
            chai.request(server)
                .get('/users')
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.an('array');
                    response.body.length.should.be.eq(0);
                    done();
                })
        })
    })

    describe('POST /users/register', () => {
        it('It should successfully register a new user', (done) => {
            const newUser = {
                name: "Lionel Messi",
                email: "lionel@messi.com",
                password: "123456"
            }
            chai.request(server)
                .post('/users/register')
                .send(newUser)
                .end((err, response) => {
                    response.should.have.status(201);
                    response.body.should.be.a('object');
                    response.body.should.have.property('message').eql('User successfully registered');
                    response.body.should.have.nested.property('user.name').that.deep.eql(newUser.name);
                    response.body.should.have.nested.property('user.email').that.deep.eql(newUser.email);
                    done();
                })
        });

        it('Register failed by empty email', (done) => {
            const newUser = {
                name: "Lionel Messi",
                email: null,
                password: "123456"
            }
            chai.request(server)
                .post('/users/register')
                .send(newUser)
                .end((err, response) => {
                    response.should.have.status(400);
                    response.body.should.be.a('object');
                    response.body.should.have.property('errors');
                    done();
                })
        })

        it('Register failed by empty name', (done) => {
            const newUser = {
                name: null,
                email: 'lionel@messi.com',
                password: "123456"
            }
            chai.request(server)
                .post('/users/register')
                .send(newUser)
                .end((err, response) => {
                    response.should.have.status(400);
                    response.body.should.be.a('object');
                    response.body.should.have.property('errors');
                    done();
                })
        })
    })

    describe('GET /users/:id', () => {
        it('It should return a single user', (done) => {
            const user = new User({
                name: 'Xavi Hernandez',
                email: 'xavi@test.com',
                password: 'test1234'
            });

            user.save((err, user) => {
                chai.request(server)
                .get('/users/' + user.id)
                .send(user)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.have.property('_id').eql(user.id);
                    response.body.should.have.property('name').eql(user.name);
                    response.body.should.have.property('email').eql(user.email);
                    done();
                })
            })
        })
    })

});