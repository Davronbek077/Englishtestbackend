const express = require("express");
const router = express.Router();

const {
  getTests,
  getQuestions,
  checkAnswers
} = require("../controllers/testController");

router.get("/", getTests);
router.get("/:testId/questions", getQuestions);
router.post("/check", checkAnswers);

module.exports = router;
