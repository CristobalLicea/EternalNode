const filteredResults = require('../middleware/filteredResults');
const Message = require('../models/Message');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

exports.createMessage = asyncHandler(async (req, res, next) => {
  const message = await Message.create(req.body);
  console.log(req.body);
  res.status(200).json({ success: true, data: message})
});

exports.getMessages = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.filteredResults)
});

exports.getRoomMessages = asyncHandler(async (req, res, next) => {
  const msgs = await Message.find({ roomId: req.params.id })

  if(!msgs) {
    return next(new ErrorResponse(`Messages not found with Room ID of ${req.params.id}`, 404))
  }

  res.status(200).json({ success: true, data: msgs })
});

exports.updateMessage = asyncHandler(async (req, res, next) => {
  const msg = await Message.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  })

  if(!msg) {
    res.status(400).json({ success: false });
  }
  res.status(200).json({ sucess: true, data: msg})
});

exports.deleteMessage = asyncHandler(async (req, res, next) => {
  const delMsg = await Message.findByIdAndDelete(req.params.id)
  res.status(200).json({ success: true, message: "Message Deleted"})
});
