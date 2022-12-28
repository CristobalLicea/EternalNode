const express = require('express')
const router = express.Router();
const filteredResults = require('../middleware/filteredResults');

const {
  getAwsUrl
} = require('../controllers/s3');

router.route('/')
  .get(getAwsUrl)

  module.exports = router;