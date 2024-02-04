const express = require('express');
const mongoose = require('mongoose');
const blogsRouter = require('./routes/blogs');
const app = express();
const Blog = require('./models/blog');
require('dotenv').config();
const methodOverride = require('method-override')

const PORT = process.env.PORT || 3000; 

mongoose.connect('mongodb://localhost/blog', {
    // useNewUrlParser: true,
    // useUnifiedTopology: true
});

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: false}))
app.use(methodOverride('_method'))


app.get('/', async (req, res) => {
    const blogs = await Blog.find().sort({
        createdAt: 'desc'
    });

    res.render('blogs/index', {blogs: blogs})
})
app.use('/blogs', blogsRouter);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})


