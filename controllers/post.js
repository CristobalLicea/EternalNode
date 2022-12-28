const filteredResults = require('../middleware/filteredResults');
const Post = require('../models/Post');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

exports.createPost = asyncHandler(async (req, res, next) => {
    const post = await Post.create(req.body)
    res.status(200).json({ success: true, data: post})
});

exports.getPosts = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.filteredResults)
});

exports.getPost = asyncHandler(async (req, res, next) => {

  const post = await Post.findById(req.params.id)
  
  if(!post) {
    return next(new ErrorResponse(`Post not found with Id of ${req.params.id}`, 404));
  }
  res.status(200).json({ success: true, data: post})
});

exports.updatePost = asyncHandler(async (req, res, next) => {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })

    if (!post) {
      res.status(400).json({ success: false });
    }
    res.status(200).json({ success: true, data: post})
});

exports.deletePost = asyncHandler(async (req, res, next) => {
    const getPosts = await Post.findByIdAndDelete(req.params.id)
    res.status(200).json({ success: true, message: "Post Deleted"})
});