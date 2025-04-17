const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
    },
    sort_id: {
      type: Number,
      default: 10,
    },
    title: {
      type: String,
      required: true,
    },
    sub_title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    features_title: {
      type: String,
      required: true,
    },
    features_sub_titles: [{ type: String, required: true }],
    ingredients: {
      type: String,
      required: true,
    },
    availability: [{ type: String, required: true }],
    cta_buttons: [
      {
        cta_button_name: { type: String },
        cta_button_color: { type: String },
        cta_button_link: { type: String },
      },
    ],
    main_image: { type: String, required: true },
    banner_image:{ type: String, required: true },
    highlight_media: { type: String, required: true },
    thumbnail_image: { type: String, required: true },
    product_images: [{ type: String, required: true }],
    thumbnail_images: [{ type: String, required: true }],
    product_text_color: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const ProductDataModel = mongoose.model("Product", ProductSchema);

module.exports = {
  ProductDataModel,
};
