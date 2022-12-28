const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  message: {
    type: String,
    required: [true, 'Please add a Message'],
    trim: true,
    maxLength: [500, 'Message cannot exceed 500 characters']
  },
  authorId: {
    type: String
  },
  roomId: {
    type: String,
    required: [true, 'Please add Message Author']
  },
  author: {
    type: String,
    required: [true, 'Please add Message Author']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('Message', MessageSchema);