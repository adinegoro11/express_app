const controller = require('../../../../controllers/movies')
const Movie = require('../../../../models/Movie')
// const server = require('./../../../../app.js')
const chai = require('chai')
let sinon = require('sinon')
const expect = chai.expect;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const should = chai.should();

/*
describe('controllers.movies.js', function () {
    it('exists', function () {
        expect(controller).to.exist
    })
})

describe('/GET movies', () => {
    it('it should send all movies', (done) => {
        var firstMovie = {
            name: 'Kamen Rider Build',
            description: 'Kamen Rider Build',
            release_year: 2014,
            genre: 'action',
        };
        var secondMovie = {
            name: 'Attack on Titan',
            description: 'Simple Desc Attack on Titan',
            release_year: 2013,
            genre: 'action',
        };
        var expectedMovies = [firstMovie, secondMovie];
        sinon.mock(Movie)
            .expects('find')
            .yield('', expectedMovies);
        chai.request(server)
            .get('/movies')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.an('object');
                expect(res.body).to.eql({
                    movies: expectedMovies
                });
                done();
            })
    })
})
*/