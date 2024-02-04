const express = require('express');
const router = express.Router();
const Blog = require('../models/blog')
const { body, validationResult } = require('express-validator');

router.get('/new', (req, res) => {
    res.render('blogs/new', {blog: new Blog()})
})

router.get('/edit/:id', async (req, res) => {
    const blog = await Blog.findById(req.params.id);
    res.render('blogs/edit', {blog: blog})
})

router.get('/:id', async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id)
        if( !blog ) res.redirect('/')
        res.render('blogs/show', { blog: blog });       
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
 
})

const validateBlog = [
    body('title').isLength({ min: 1 }).withMessage('Title must not be empty'),
    body('body').isLength({ min: 1 }).withMessage('Body must not be empty'),
  ];

router.post('/',
     validateBlog, async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.status(400).json({errors: errors.array});
        }
        const {title, author, body, description} = req.body;    
        let blog = new Blog({
            title: title,
            author: author, 
            body: body,
            description: description
        })
        try {
            blog = await blog.save();
            res.redirect(`/blogs/${blog.id}`)
        } catch (error) {
         console.log(error);
           res.render('blogs/new', { blog: blog })
        }
})

router.put("/:id", async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const blogId = req.params.id;
    console.log(blogId);
    const { title, author, body, description } = req.body;

    try {
        // let blog = await Blog.findById(req.params.id);
        // if (!blog) {
        //     return res.status(404).send("Blog not found");
        // }
        // blog.title = req.body.title;
        // blog.description = req.body.description;
        // blog.author = req.body.author;
        // blog.body = req.body.body;

        // blog = await blog.save();

        const updatedBlog = await Blog.updateOne(
            { _id: blogId },
            {
              $set: {
                title,
                author,
                body,
                description,
              },
            }
          );

          if (updatedBlog.matchedCount === 0) {
            return res.status(404).send('Blog not found');
          }
        res.redirect(`/blogs/${blogId}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});



router.delete('/:id', async (req, res) => {
    const blogId = req.params.id;
    try {
        const deletedBlog = await Blog.deleteOne({ _id: blogId})
        if(deletedBlog.deletedCount === 0){
            return res.status(404).send('Blog not found');
        }
        res.redirect('/')
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server error');
    }

    // await Blog.findByIdAndDelete(req.params.id)
    // res.redirect('/')
})




module.exports = router;