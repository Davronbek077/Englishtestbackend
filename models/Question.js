const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    testId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Test",
      required: true
    },

    type: {
      type: String,
      enum: [
        "dropdown-fill", // test-english style
        "mcq"
      ],
      required: true
    },

    // Instruction (masalan: Choose correct answer)
    question: {
      type: String,
      required: true
    },

    // 🔥 Universal data (hamma type uchun)
    content: {
      type: Object,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Question", questionSchema);