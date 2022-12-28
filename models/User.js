const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    maxLength: [30, 'Name cannot exceed 30 characters']
  },
  clearance: {
    type: String,
    enum: ['User', 'Admin'],
    default: "User"
  },
  email: {
    type: String,
    required: [true, 'Please add an Email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add valid email'
    ]
  },
  userImage: {
    type: String,
    default: ''
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 8,
    select: false
  },
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  birthday: {
    type: Date
  },
  flaves: {
    type: Number,
    default: 0
  },
  hearts: {
    type: Number,
    default: 20
  },
  resetPasswordToken: String,
  resetPasswordExpired: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

UserSchema.pre('save', async function(next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.getSignedJwt = function(next) {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  })
};

UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);