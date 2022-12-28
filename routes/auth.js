const express = require('express');
const router = express.Router();

const { register, login, getLoggedInUser, updateUser } = require('../controllers/auth');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getLoggedInUser);

router.route('/:id')
  .put(protect, updateUser)

module.exports = router;