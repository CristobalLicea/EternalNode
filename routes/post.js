const express = require('express')
const router = express.Router();
const filteredResults = require('../middleware/filteredResults');
const Post = require('../models/Post');

const {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost
} = require('../controllers/post');

const { protect } = require('../middleware/auth');

router.route('/')
  .get(filteredResults(Post), getPosts)
  .post(protect, createPost)

router.route('/:id')
  .get(getPost)
  .put(protect, updatePost)
  .delete(protect, deletePost)

module.exports = router;