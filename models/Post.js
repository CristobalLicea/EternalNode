const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a Title'],
    trim: true,
    maxLength: [30, 'Title cannot exceed 30 characters']
  },
  description: {
    type: String,
    maxLength: [300, 'Description cannot exceed 300 characters'],
  },
  uploadedBy: {
    type: String,
    required: [true, 'Please add Post Author']
  },
  authorId: {
    type: String,
    required: [true, 'User ID needed']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  comments: [{ comment: String, author: String, date: {type: Date, default: Date.now}, hearts: {type: Number, default: 0}, laughs: {type: Number, default: 0}, authorId: String, replies: [{
    reply: String, author: String, date: {type: Date, default: Date.now}, hearts: {type: Number, default: 0}, laughs: {type: Number, default: 0}, authorId: String}]
  }],
  hearts: {
    type: Number,
    default: 0
  },
  laughs: {
    type: Number,
    default: 0
  },
  slug: String,
  photo: {
    type: String,
    default: ''
  }
});

module.exports = mongoose.model('Post', PostSchema);