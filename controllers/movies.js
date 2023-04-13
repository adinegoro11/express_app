const MovieSchema = require('../models/Movie');
const Rating = require('../models/Rating');
const { body, validationResult } = require('express-validator');

module.exports.controller = (app) => {
    // fetch all movies
    app.get('/movies', (req, res) => {
        MovieSchema.find({}, 'name description release_year genre', (error, movies) => {
            if (error) {
                console.log(error);
            } else {
                return res.status(200).json({ error: false, result: movies });
            }
        })
    })
    // fetch a single movie
    app.get(
        '/movies/:id',
        (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            MovieSchema.findById(req.params.id, 'name description release_year genre', (error, movie) => {
                if (error) {
                    console.log(error);
                } else {
                    return res.status(200).json({ error: false, result: movie });
                }
            })
        })
    // add a new movie
    app.post(
        '/movies',
        body('name').isLength({ min: 3 }),
        body('description').isLength({ min: 3 }),
        body('release_year').isInt(),
        body('genre').isIn(['action', 'comedy', 'drama', 'romance']),
        (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const newMovie = new MovieSchema({
                name: req.body.name,
                description: req.body.description,
                release_year: req.body.release_year,
                genre: req.body.genre,
            });

            newMovie.save((error, movie) => {
                if (error) {
                    console.log(error);
                }
                res.status(201).json({ error: false, result: movie });
            })
        })
    // rate a movie
    app.post(
        '/movies/rate/:id',
        body('user_id').isLength({ min: 3 }),
        body('rate').isInt(),
        (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const rating = new Rating({
                movie_id: req.params.id,
                user_id: req.body.user_id,
                rate: req.body.rate,
            })

            rating.save(function (error, rating) {
                if (error) {
                    console.log(error);
                }
                res.status(201).json({ error: false, result: rating });
            })
        })
}