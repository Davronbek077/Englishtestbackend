require("dotenv").config(); // ENG YUQORIDA

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const testRoutes = require("./routes/testRoutes");
const questionRoutes = require("./routes/QuestionRoutes");

const app = express();

const fs = require("fs");
if (!fs.existsSync("uploads")) fs.mkdirSync("uploads");

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/tests", testRoutes);
app.use("/api/questions", questionRoutes);
app.use("/uploads", express.static("uploads"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
