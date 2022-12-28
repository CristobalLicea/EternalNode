const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  name: String, default: "",
  description: String, default: ""
});

module.exports = mongoose.model('Room', RoomSchema);
