const express = require("express");
const router = express.Router();
const upload = require("../utils/Uploads");

const Test = require("../models/Test");

const {
  getTests,
  getQuestions,
  checkAnswers,
  createTest,
  createQuestion,
  getTestById,
  deleteAllTests
} = require("../controllers/testController");

router.put("/:id", upload.single("image"), async (req, res) => {
  
  try {
    const imagekit = require("../utils/imagekit");

    const { explanation, downloadText } = req.body;

    let downloads = [];
    if (req.body.downloads) {
      downloads = JSON.parse(req.body.downloads);
    }

    const updateData = {
      explanation,
      downloadText,
      downloads,
    };

    if (req.file) {
      const result = await imagekit.upload({
        file: req.file.buffer,
        fileName: Date.now() + "-" + req.file.originalname,
        folder: "explanations",
      });

      updateData.explanationImage = result.url;
    }

    const updated = await Test.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

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
