const express = require("express");
const router = express.Router();

const {
  getTests,
  getQuestions,
  checkAnswers,
  createTest
} = require("../controllers/testController");

router.get("/", getTests);
router.post("/", createTest);           // ✅ TEST QO‘SHISH
router.get("/:testId/questions", getQuestions);
router.post("/check", checkAnswers);

module.exports = router;
