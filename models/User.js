const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  totalScore: {
    type: Number,
    default: 0
  },

  testsCompleted: {
    type: Number,
    default: 0
  },

  correctAnswers: {
    type: Number,
    default: 0
  },

  wrongAnswers: {
    type: Number,
    default: 0
  },

  streak: {
    type: Number,
    default: 0
  },

  accuracy: {
    type: Number,
    default: 0
  }

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);