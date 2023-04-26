const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('./../app');

chai.should();
chai.use(chaiHttp);
describe('Task API', () => {

    describe('GET /api/users', () => {
        it('It should get all users', (done) => {
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
});