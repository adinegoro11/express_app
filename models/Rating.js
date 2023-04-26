const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const RatingSchema = new Schema({
    movie_id: {
        type: String,
        required: true,
    },
    user_id: {
        type: String,
        required: true,
    },
    rate: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
})

const Rating = mongoose.model("Rating", RatingSchema)
module.exports = Rating