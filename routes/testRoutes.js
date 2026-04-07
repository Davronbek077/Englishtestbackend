const express = require("express");
const router = express.Router();

const {
  getTests,
  getQuestions,
  checkAnswers,
  createTest,
  createQuestion,
  getTestById,
  deleteAllTests
} = require("../controllers/testController");

const upload = require("../utils/Uploads");

// Barcha testlar
router.get("/", getTests);

// Admin karta yaratish (image bilan)
router.post("/", upload.single("thumbnail"), createTest);

// Test ichidagi savollarni olish
router.get("/:testId/questions", getQuestions);

// Yangi savol yaratish
router.post("/questions", createQuestion);

// Student javoblarini tekshirish
router.post("/check", checkAnswers);

// Bitta karta + savollar
router.get("/:testId", getTestById);

router.delete("/", deleteAllTests);

module.exports = router;
