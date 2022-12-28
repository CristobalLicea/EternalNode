const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const { generateUploadURL } = require('../middleware/s3');

exports.getAwsUrl = asyncHandler(async (req, res, next) => {
  const url = await generateUploadURL(req.query.title)
  res.send({ url })
});