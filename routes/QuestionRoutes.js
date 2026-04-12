const express = require("express");
const router = express.Router();
const controller = require("../controllers/testController");

// create
router.post("/", controller.createQuestion);

// get by test
router.get("/:testId", controller.getQuestions);

// delete
router.delete("/:id", controller.deleteQuestion);

module.exports = router;
