var movies = require('../../../controllers/movies.js');
const Movie = require('../../../models/Movie')
let chaiHttp = require('chai-http');
const chai = require('chai');
let sinon = require('sinon')
var expect = chai.expect;
const should = chai.should();
var express = require('express');
let server = require('./../../../app.js');
var app = express();
chai.use(chaiHttp);

function buildResponse() {
    return http_mocks.createResponse({
        eventEmitter: require('events').EventEmitter
    })
}

describe('controllers.movies.js', function(){
    it('exists', function(){
        expect(movies).to.exist
    })
})

describe('/GET dummy_test', () => {
    it('it should respond with a name object', (done) => {
        chai.request(server)
        .get('/dummy_test')
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.an('object');
            done();
        })
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