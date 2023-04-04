var User = require('../models/User');

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
                console.log(error);
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
}