const express = require('express');
const router = express.Router();
const Room = require('../models/Room')

const { 
  createRoom, 
  getRooms,
  updateRoom, 
  deleteRoom } = require('../controllers/room');
const { protect } = require('../middleware/auth');
const filteredResults = require('../middleware/filteredResults');

router.route('/')
  .post(protect, createRoom)
  .get(filteredResults(Room), getRooms)

router.route('/:id')
  .put(protect, updateRoom)
  .delete(protect, deleteRoom)

  module.exports = router;