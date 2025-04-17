const mongoose = require("mongoose");

const bcrypt = require("bcrypt");

const deviceDetailSchema = new mongoose.Schema({
  otp: { type: String, default: null },
  createdAt: {
    type: String,
  },
});

const AdminSchema = new mongoose.Schema({
  email_id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  mobile: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String ,required:true},
  pages: { type: [String],default:[] },
  lastLogin: { type: Date },
  deviceDetail: [deviceDetailSchema],
  isActive:{type:Boolean,default:true}
});

const AdminDataModel = mongoose.model("Admin", AdminSchema);

module.exports = { AdminDataModel };