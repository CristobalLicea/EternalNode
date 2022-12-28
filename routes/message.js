const express = require('express');
const router = express.Router();
const Message = require('../models/Message')

const { 
  createMessage, 
  getRoomMessages,
  getMessages, 
  updateMessage, 
  deleteMessage } = require('../controllers/message');
const { protect } = require('../middleware/auth');
const filteredResults = require('../middleware/filteredResults');

router.route('/')
  .post(protect, createMessage)
  .get(filteredResults(Message), getMessages)

router.route('/byroom/:id')
  .get(protect, getRoomMessages)

router.route('/:id')
  .put(protect, updateMessage)
  .delete(protect, deleteMessage)

  module.exports = router;