var User = require('../models/User');

const passportJWT = require('passport-jwt');
const jwt = require('jsonwebtoken');
const ExtractJwt = passportJWT.ExtractJwt;
const jwtOptions = {};
jwtOptions.jwtFromRequest = passportJWT.ExtractJwt.fromAuthHeaderWithScheme('jwt');
jwtOptions.secretOrKey = 'th3$ecr3tKey';

module.exports.controller = (app) => {
    // get all users
    app.get('/users', (req, res) => {
        User.find({}, 'name email', function (error, users) {
            if (error) {
                console.log(error);
            }
            res.send(users);
        })
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
    app.put('/users/:id', (req, res) => {
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
                res.send({ success: true })
            }
        })
    })
    // register user
    app.post('/users/register', (req, res) => {
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
                res.send({ user });
            }
        })
    })
    // login user
    app.post('/users/login', (req,res) => {
        if (req.body.email && req.body.password) {
            const email = req.body.email;
            const password = req.body.password;
            User.getUserByEmail(email, (err, user) => {
                if (!user) {
                    res.status(404).json({message: 'User Not Found'});
                } else {
                    User.comparePassword(password, user.password, (error, isMatch) => {
                        if (error) {
                            throw error;
                        } else if (isMatch) {
                            const payload = {id: user.id};
                            const token = jwt.sign(payload, jwtOptions.secretOrKey);
                            res.json({message: 'ok', token});
                        } else {
                            res.status(401).json({message: 'Incorrect Password'});
                        }
                    })
                }
            })
        }
    })
}