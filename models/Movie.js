const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const MovieSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    release_year: {
        type: Number,
        required: true,
    },
    genre: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
})

const Movie = mongoose.model('Movie', MovieSchema)
module.exports = Movie