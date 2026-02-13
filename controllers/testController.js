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

/* GET SINGLE TEST (Card Detail) */
exports.getTestById = async (req, res) => {
  try {
    const test = await Test.findById(req.params.testId);
    if (!test) return res.status(404).json({ message: "Test not found" });

    const questions = await Question.find({ testId: req.params.testId })
      .select("-correctAnswer -correctText -correctOrder -pairs.right");

    res.json({ test, questions });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/* CREATE TEST (Admin karta + darslik + downloads) */
exports.createTest = async (req, res) => {
  try {
    console.log("BODY:", req.body);       // frontenddan kelayotgan ma’lumot
    console.log("FILE:", req.file);       // fayl kelayotgan yoki yo‘qligi

    const { title, skill, level, description, downloads, isPro } = req.body;
    if (!title || !skill || !level)
      return res.status(400).json({ message: "Missing required fields" });

    const test = await Test.create({
      title,
      skill,
      level,
      description,
      thumbnail: req.file ? `/uploads/${req.file.filename}` : null,
      downloads: downloads ? downloads.split(",") : [],
      isPro
    });

    res.status(201).json(test);
  } catch (err) {
    console.error("CREATE TEST ERROR:", err); // ❗ xatoni aniq ko‘rsatadi
    res.status(500).json({ message: err.message });
  }
};

/* CREATE QUESTION */
exports.createQuestion = async (req, res) => {
  try {
    const q = await Question.create(req.body);
    res.status(201).json(q);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/* CHECK ANSWERS */
exports.checkAnswers = async (req, res) => {
  try {
    const { answers } = req.body;
    if (!answers || !Array.isArray(answers)) return res.status(400).json({ message: "Invalid answers format" });

    let score = 0;
    let pending = 0;

    for (let ans of answers) {
      const q = await Question.findById(ans.questionId);
      if (!q) continue;

      switch (q.type) {
        case "mcq":
        case "listening":
          if (ans.selected === q.correctAnswer) score++;
          break;
        case "fill":
          if (q.correctText.some(t => t.toLowerCase() === ans.text?.trim().toLowerCase())) score++;
          break;
        case "multi-fill":
          if (JSON.stringify(ans.texts?.map(t => t.toLowerCase())) === JSON.stringify(q.correctText.map(t => t.toLowerCase()))) score++;
          break;
        case "ordering":
          if (JSON.stringify(ans.order) === JSON.stringify(q.correctOrder)) score++;
          break;
        case "matching":
          if (JSON.stringify(ans.pairs) === JSON.stringify(q.pairs)) score++;
          break;
        case "writing":
          pending++;
          break;
      }
    }

    const total = answers.length;
    const percent = total ? Math.round((score / total) * 100) : 0;

    res.json({ correct: score, total, percent, pendingReview: pending });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
