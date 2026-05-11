const router = require("express").Router();
const leaderboardController = require("../controllers/leaderboardController");

router.get("/", leaderboardController.getLeaderboard);

module.exports = router;
