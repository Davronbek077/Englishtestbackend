const Test = require("../models/Test");
const Question = require("../models/Question");

/* GET ALL TESTS */
exports.getTests = async (req, res) => {
  try {
    const { skill, level } = req.query;
    const query = {};
    if (skill) query.skill = skill;
    if (level) query.level = level;

    const tests = await Test.find(query);
    res.json(tests);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE all tests + their questions
exports.deleteAllTests = async (req, res) => {
  try {
    // Barcha testlarni o'chirish
    await Test.deleteMany({});

    // Barcha savollarni o'chirish
    await Question.deleteMany({});

    res.json({ message: "All tests and their questions have been deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/* GET SINGLE TEST (Card Detail) */
exports.getTestById = async (req, res) => {
  try {
    const test = await Test.findById(req.params.testId);
    if (!test) return res.status(404).json({ message: "Test not found" });

    // ❗ endi hech narsani yashirmaymiz
    const questions = await Question.find({ testId: req.params.testId });

    res.json({ test, questions });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/* CREATE TEST (Admin karta + darslik + downloads) */
const imagekit = require("../utils/imagekit");

exports.createTest = async (req, res) => {
  try {
    console.log("FILE:", req.file);
    const { title, skill, level, description, downloads } = req.body;

    if (!title || !skill || !level) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    let imageUrl = null;

    if (req.file) {
      const result = await imagekit.upload({
        file: req.file.buffer, // 🔥 buffer
        fileName: Date.now() + "-" + req.file.originalname
      });

      imageUrl = result.url;
    }

    const test = await Test.create({
      title,
      skill,
      level,
      description,
      thumbnail: imageUrl,
      downloads: downloads ? downloads.split(",") : [],
    });

    res.status(201).json(test);
  } catch (err) {
    console.error("CREATE TEST ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/* CREATE QUESTION */
exports.createQuestion = async (req, res) => {
  try {
    const { testId, type, question, content } = req.body;

    if (!testId || !type || !question || !content) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const q = await Question.create({
      testId,
      type,
      question,
      content
    });

    res.status(201).json(q);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getQuestions = async (req, res) => {
  try {
    const questions = await Question.find({ testId: req.params.testId })

    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteQuestion = async (req, res) => {
  try {
    await Question.findByIdAndDelete(req.params.id);
    res.json({ message: "Savol o‘chirildi" });
  } catch (err) {
    res.status(500).json({ message: "Delete xatolik" });
  }
};

/* CHECK ANSWERS */
exports.checkAnswers = async (req, res) => {
  try {
    const { answers } = req.body;

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ message: "Invalid answers format" });
    }

    let score = 0;

    for (let ans of answers) {
      const q = await Question.findById(ans.questionId);
      if (!q) continue;

      // 🔥 dropdown-fill tekshirish
      if (q.type === "dropdown-fill") {
        let correct = true;

        q.content.sentences.forEach((sentence, sIndex) => {
          sentence.blanks.forEach((blank, bIndex) => {
            const userAnswer = ans.answers?.[sIndex]?.[bIndex];

            if (userAnswer !== blank.correct) {
              correct = false;
            }
          });
        });

        if (correct) score++;
      }

      // 🔥 writing (tekshirilmaydi)
      if (q.type === "writing") {
        // manual review
      }
    }

    const total = answers.length;
    const percent = total ? Math.round((score / total) * 100) : 0;

    res.json({
      correct: score,
      total,
      percent
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};