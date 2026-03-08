require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const path = require("path");
const fs = require("fs");

const testRoutes = require("./routes/testRoutes");
const questionRoutes = require("./routes/QuestionRoutes");

const app = express();

/* uploads folder */
const uploadPath = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

/* middlewares */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* database */
connectDB();

/* routes */
app.use("/api/tests", testRoutes);
app.use("/api/questions", questionRoutes);

/* static files */
app.use("/uploads", express.static(uploadPath));

/* start server */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});