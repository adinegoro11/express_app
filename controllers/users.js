var User = require('../models/User');
const config = require('../config/Config');

const passportJWT = require('passport-jwt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const ExtractJwt = passportJWT.ExtractJwt;
const jwtOptions = {};
jwtOptions.jwtFromRequest = passportJWT.ExtractJwt.fromAuthHeaderWithScheme('jwt');
jwtOptions.secretOrKey = config.SECRET_KEY;

module.exports.controller = (app) => {
    // get all users
    app.get('/users', paginatedResults(User, "name email createdAt"), (req, res) => {
        res.status(200).json(res.paginatedResults)
    })
    // get single user
    app.get('/users/:id', (req, res) => {
        User.findById(req.params.id, 'name email', function (error, user) {
            if (error) {
                console.log(error);
            } else {
                res.send(user);
            }
        })
    })
    // add a new user
    app.post('/users', (req, res) => {
        const newUser = new User({
            name: req.body.name,
            email: req.body.email
        })

        newUser.save(function (error, newUser) {
            if (error) {
                res.send(error);
            } else {
                res.send(newUser)
            }
        })
    })
    // update a user
    app.put(
        '/users/:id',
        body('name').isLength({ min: 3 }),
        body('email').isEmail(),
        (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            User.findById(req.params.id, 'name email', function (error, user) {
                if (error) {
                    console.error(error);
                }
                user.name = req.body.name
                user.email = req.body.email
                user.save(function (error, user) {
                    if (error) {
                        console.log(error);
                    } else {
                        res.send(user)
                    }
                })
            })
        })
    // delete a user
    app.delete('/users/:id', (req, res) => {
        User.findByIdAndDelete(req.params.id, function (error, user) {
            if (error) {
                console.log(error);
            } else {
                return res.status(200).json({ message: 'User successfully deleted' });
            }
        })
    })
    // register user
    app.post(
        '/users/register',
        body('name').isLength({ min: 3 }),
        body('email').isEmail(),
        body('password').isLength({ min: 3 }),
        (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const name = req.body.name;
            const email = req.body.email;
            const password = req.body.password;
            const newUser = new User({
                name,
                email,
                password,
            });
            User.createUser(newUser, (error, user) => {
                if (error) {
                    res.status(422).json({
                        message: 'Something wrong, please try again after some time'
                    });
                } else {
                    return res.status(201).json({
                        message: "User successfully registered",
                        user
                    });
                }
            })
        })
    // login user
    app.post(
        '/users/login',
        body('email').isEmail(),
        body('password').isLength({ min: 3 }),
        (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const email = req.body.email;
            const password = req.body.password;
            User.getUserByEmail(email, (err, user) => {
                if (!user) {
                    return res.status(404).json({ message: 'User Not Found' });
                }
                User.comparePassword(password, user.password, (error, isMatch) => {
                    if (error) {
                        throw error;
                    } else if (isMatch) {
                        const payload = { id: user.id };
                        const token = jwt.sign(payload, jwtOptions.secretOrKey);
                        return res.status(200).json({ message: 'ok', token });
                    } else {
                        return res.status(401).json({ message: 'Incorrect Password' });
                    }
                })
            })
        })
}

function paginatedResults(model, columns) {
    return async (req, res, next) => {
        const page = parseInt(req.query.page)
        const limit = parseInt(req.query.limit)

        const startIndex = (page - 1) * limit
        const endIndex = page * limit
        const results = {}

        if (endIndex < await model.countDocuments().exec()) {
            results.next = {
                page: page + 1,
                limit: limit
            }
        }

        if (startIndex > 0) {
            results.previous = {
                page: page - 1,
                limit: limit
            }
        }
        try {
            results.results = await model.find({}, columns).limit(limit).skip(startIndex).exec()
            res.paginatedResults = results
            next()
        } catch (e) {
            res.status(500).json({ message: e.message })
        }
    }
}