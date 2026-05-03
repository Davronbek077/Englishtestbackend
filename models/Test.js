const mongoose = require("mongoose");

const testSchema = new mongoose.Schema({
  title: { type: String, required: true },
  skill: { type: String, enum: ["grammar","vocabulary","listening","reading","writing","mock"], required: true },
  level: { type: String, enum: ["A1","A2","B1","B2","B2+","C1"], required: true },
  description: { type: String },           // darslik yoki tushuntirish
  thumbnail: { type: String },             // karta rasmi
  explanation: {type: String},
downloads: [
  {
    title: String,
    url: String
  }
],
downloadText: String
}, { timestamps: true });

module.exports = mongoose.model("Test", testSchema);
