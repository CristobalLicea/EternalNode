const filteredResults = require('../middleware/filteredResults');
const Room = require('../models/Room');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

exports.createRoom = asyncHandler(async (req, res, next) => {
  const room = await Room.create(req.body);
  console.log(req.body);
  res.status(200).json({ success: true, data: room})
});

exports.getRooms = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.filteredResults)
})

exports.getRoom = asyncHandler(async (req, res, next) => {
  const room = await Room.findById(req.params.id)

  if(!room) {
    return next(new ErrorResponse(`Room not found with ID of ${req.params.id}`, 404))
  }
  res.status(200).json({ success: true, data: room })
})

exports.updateRoom = asyncHandler(async (req, res, next) => {
  const room = await Room.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  })
  if (!room) {
    res.status(400).json({ success: false})
  }
  res.status(200).json({ success: true, data: room})
})

exports.deleteRoom = asyncHandler(async (req, res, next) => {
  await Room.findByIdAndDelete(req.params.id)
  res.status(200).json({ success: true, message: "Room Deleted"})
})
