const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    body: {type: String, required: true},
    author: {type: String, required: true}
})


const tweetSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 100
    },
    body: {
        type: String,
        required: true,
        minLength: 1, 
        maxLength: 255
    },
    author: {
        type: String,
        required: true
    },
    likes: {
        type: Number,
        default: 0
    },
    sponsored: {
        type: Boolean,
        default: false
    },
    comments: [commentSchema]
}, {timestamps: true});

// creating the model.. first you create a schema like above. then you create a variable name for it, pass in the schema and then export it so you can use it for other files
const Tweet = mongoose.model('Tweet', tweetSchema);
module.exports = Tweet;