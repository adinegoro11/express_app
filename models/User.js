const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
})

const User = mongoose.model("User", UserSchema)
module.exports = User

module.exports.createUser = (newUser, callback) => {
    bcryptjs.genSalt(10, (err, salt) => {
        bcryptjs.hash(newUser.password, salt, (error, hash) => {
            //
            const newUserResource = newUser;
            newUserResource.password = hash;
            newUserResource.save(callback);
        });
    });
}