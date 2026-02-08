require("dotenv").config(); // ENG YUQORIDA

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const testRoutes = require("./routes/testRoutes");
const questionRoutes = require("./routes/QuestionRoutes");

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/tests", testRoutes);
app.use("/api/questions", questionRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
