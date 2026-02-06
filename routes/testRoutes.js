const express = require("express");
const router = express.Router();
const Question = require("../models/Question");

const {
  getTests,
  getQuestions,
  checkAnswers
} = require("../controllers/testController");

router.post("/", async (req, res) => {
  try {
    const question = await Question.create(req.body);
    res.status(201).json(question);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/", getTests);
router.get("/:testId/questions", getQuestions);
router.post("/check", checkAnswers);

module.exports = router;
