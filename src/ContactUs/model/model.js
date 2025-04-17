const mongoose = require("mongoose");


const ContactUsDataSchema = mongoose.Schema(
  {
    name: {
      type: String,
    },
    mobile_number: {
      type: Number,
    },
    email_id: {
      type: String,
    },
    message: {
      type: String,
    },
  },
  { timestamps: true }
);

const ContactUsDataModel = new mongoose.model("Contact US", ContactUsDataSchema);

module.exports = ContactUsDataModel;
