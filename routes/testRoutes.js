const express = require("express");
const router = express.Router();

const {
  getTests,
  getQuestions,
  checkAnswers,
  createTest,
  createQuestion,
  getTestById
} = require("../controllers/testController");

// Barcha testlar
router.get("/", getTests);

// Admin karta + darslik + downloads qo‘shish
router.post("/", createTest); 

// Test ichidagi savollarni olish
router.get("/:testId/questions", getQuestions);

// Yangi savol yaratish (Admin)
router.post("/questions", createQuestion);

// Student javoblarini tekshirish
router.post("/check", checkAnswers);

// Bitta karta + savollar + darsliklarni olish
router.get("/:testId", getTestById);

module.exports = router;
