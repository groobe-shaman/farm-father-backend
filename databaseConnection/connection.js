const mongoose = require("mongoose");
require("dotenv").config();
const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/farm-father";
mongoose.set("strictQuery", false);
mongoose
  .connect(uri)
  .then(() => {
    console.log("Database Connection Established!");
  })
  .catch((err) => {
    console.log(`No DataBase Connection! ${err}`);
  });
