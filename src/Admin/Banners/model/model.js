const mongoose = require("mongoose");

const BannerSchema = new mongoose.Schema(
    {
      title: { type: String, required: true },
      description: { type: String, required: true },
      thumbnail_image: { type: String, required: true },
      product_color:{ type: String, required: true },
      banner_image: { type: String, required: true },
    },
    { timestamps: true } 
  );
  
  const BannerDataModel = mongoose.model("Banner", BannerSchema);

  module.exports={
    BannerDataModel
  }