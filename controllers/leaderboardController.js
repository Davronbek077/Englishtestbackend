const User = require("../models/User");

exports.getLeaderboard = async (req, res) => {
  try {
    const users = await User.find()
    .sort({
      totalScore: -1,
      accuracy: -1,
      testsCompleted: -1
    })
      .limit(50)
      .select("username totalScore accuracy testsCompleted");

    res.json(users);

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};