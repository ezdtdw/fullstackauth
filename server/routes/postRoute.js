const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const auth = require('../middleware/auth');

// Get all posts (public)
router.get('/', postController.getAllPosts);

// Get post by ID (public)
router.get('/:id', postController.getPostById);

// Create post (authenticated)
router.post('/', auth, postController.createPost);

// Update post (authenticated)
router.put('/:id', auth, postController.updatePost);

// Delete post (authenticated)
router.delete('/:id', auth, postController.deletePost);

module.exports = router;
