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
}