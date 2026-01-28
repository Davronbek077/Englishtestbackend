const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  testId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Test"
  },

  type: {
    type: String,
    enum: [
      "mcq",
      "fill",
      "multi-fill",
      "matching",
      "ordering",
      "writing",
      "listening"
    ]
  },

  question: String,

  /* MCQ + Listening */
  options: [String],
  correctAnswer: Number,

  /* Fill & Multi-fill */
  correctText: [String],

  /* Matching */
  pairs: [
    {
      left: String,
      right: String
    }
  ],

  /* Ordering */
  words: [String],
  correctOrder: [String],

  /* Listening */
  audioUrl: String,

  /* Writing */
  minWords: Number
});

module.exports = mongoose.model("Question", questionSchema);
