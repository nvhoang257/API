const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const student = new Schema({
  id: { type: ObjectId },
  mssv: { type: String },
  nameStudent: { type: String },
  diemTB: { type: Number },
  boMon: { type: String },
  tuoi: { type: Number },
});
module.exports = mongoose.models.student || mongoose.model("student", student);