const mongoose = require('mongoose');
const marked = require('marked');
const slugify = require('slugify')

const blogSchema = new mongoose.Schema({
    title: {
        type: String, 
        required: true
    },
    description: {
        type: String
    }, 
    author: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date, 
        default: Date.now
    }
})

module.exports = mongoose.model('Blog', blogSchema);