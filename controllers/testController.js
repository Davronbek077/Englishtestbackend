const Test = require("../models/Test");
const Question = require("../models/Question");

/* GET TESTS */
exports.getTests = async (req, res) => {
  try {
    const {skill, level} = req.query;

    const query = {};
    if (skill) query.skill = skill;
    if (level) query.level = level;

    const tests = await Test.find(query);
    res.json(tests);
  } catch (err) {
    res.status(500).json({message: "Server error"});
  }
};

/* GET QUESTIONS */
exports.getQuestions = async (req, res) => {
  const questions = await Question.find({ testId: req.params.testId })
    .select("-correctAnswer -correctText -correctOrder -pairs.right");
  res.json(questions);
};

/* CREATE TEST */
exports.createTest = async (req, res) => {
  try {
    const { title, skill, level, description, isPro } = req.body;

    if (!title || !skill || !level) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const test = await Test.create({
      title,
      skill,
      level,
      description,
      isPro
    });

    res.status(201).json(test);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
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
          if (
            q.correctText.some(
              t => t.toLowerCase() === ans.text?.trim().toLowerCase()
            )
          ) score++;
          break;

        case "multi-fill":
          if (
            JSON.stringify(ans.texts?.map(t => t.toLowerCase())) ===
            JSON.stringify(q.correctText.map(t => t.toLowerCase()))
          ) score++;
          break;

        case "ordering":
          if (
            JSON.stringify(ans.order) === JSON.stringify(q.correctOrder)
          ) score++;
          break;

        case "matching":
          if (
            JSON.stringify(ans.pairs) === JSON.stringify(q.pairs)
          ) score++;
          break;

        case "writing":
          pending++;
          break;
      }
    }

    res.json({
      correct: score,
      pendingReview: pending
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
