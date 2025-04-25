const mongoose = require("mongoose");

const BannerSchema = new mongoose.Schema(
  {
    data: [
      {
        id: { type: String, required: true },
        isHidden: { type: Boolean, default: false },
      },
    ],
  },
  { _id: false }
);

const EssenceSchema = new mongoose.Schema(
  {
    data: [
      {
        image: { type: String, default: "" },
        title: { type: String, default: "" },
        title_color: { type: String, default: "" },
        description: { type: String, default: "" },
      },
    ],
    section_title: { type: String, default: "" },
  },
  { _id: false }
);

const ProductsSchema = new mongoose.Schema(
  {
    data: [
      {
        id: { type: String, required: true },
        isHidden: { type: Boolean, default: false },
      },
    ],
    section_title: { type: String, default: "" },
  },
  { _id: false }
);

const ProductMadeForSchema = new mongoose.Schema(
  {
    data: [
      {
        title: { type: String, default: "" },
        title_color: { type: String, default: "" },
        description: { type: String, default: "" },
        image: { type: String, default: "" },
      },
    ],
    section_title: { type: String, default: "" },
  },
  { _id: false }
);

const HowToUseSchema = new mongoose.Schema(
  {
    data: [
      {
        title: { type: String, default: "" },
        sub_title: { type: String, default: "" },
        description: { type: String, default: "" },
        image: { type: String, default: "" },
      },
    ],
    section_title: { type: String, default: "" },
  },
  { _id: false }
);

const BenefitsSchema = new mongoose.Schema(
  {
    image: { type: String, default: "" },
    section_title: { type: String, default: "" },
  },
  { _id: false }
);

const WhyChooseUsSchema = new mongoose.Schema(
  {
    feature_titles: [{ type: String, default: "" }],
    feature_title_color: { type: String, default: "" },
    description: { type: String, default: "" },
    image: { type: String, default: "" },
    section_title: { type: String, default: "" },
  },
  { _id: false }
);

const OurImpactSchema = new mongoose.Schema(
  {
    data: [
      {
        title: { type: String, default: "" },
        title_color: { type: String, default: "" },
        description: { type: String, default: "" },
        description_color: { type: String, default: "" },
        image: { type: String, default: "" },
      },
    ],
    left_big_file: { type: String, default: "" },
    right_big_file: { type: String, default: "" },
    left_small_image: [
      {
        desktop: {
          image: { type: String, default: "" },
          title: { type: String, default: "" },
          description: { type: String, default: "" },
          cta_button_name: { type: String, default: "" },
          cta_button_color: { type: String, default: "" },
          cta_button_link: { type: String, default: "" },
        },
        mobile: {
          image: { type: String, default: "" },
          title: { type: String, default: "" },
          description: { type: String, default: "" },
          cta_button_name: { type: String, default: "" },
          cta_button_color: { type: String, default: "" },
          cta_button_link: { type: String, default: "" },
        },
      },
    ],
    right_small_image: [
      {
        desktop: {
          image: { type: String, default: "" },
          title: { type: String, default: "" },
          description: { type: String, default: "" },
          cta_button_name: { type: String, default: "" },
          cta_button_color: { type: String, default: "" },
          cta_button_link: { type: String, default: "" },
        },
        mobile: {
          image: { type: String, default: "" },
          title: { type: String, default: "" },
          description: { type: String, default: "" },
          cta_button_name: { type: String, default: "" },
          cta_button_color: { type: String, default: "" },
          cta_button_link: { type: String, default: "" },
        },
      },
    ],
    section_title: { type: String, default: "" },
  },
  { _id: false }
);

const AboutUsSchema = new mongoose.Schema(
  {
    section_title: { type: String, default: "" },
    about_us_image: { type: String, default: "" },
    description: { type: String, default: "" },
    social_media_links: [
      {
        platform: {
          type: String,
          enum: ["whatsapp", "facebook", "instagram", "linkedin", "pinterest"],
          required: true,
        },
        icon: { type: String, default: "" },
        link: { type: String, default: "" },
        isHidden:{type:Boolean,default:false},
      },
    ],
  },
  { _id: false }
);

const OurWallOfLoveSchema = new mongoose.Schema(
  {
    data: [
      {
        name: { type: String, default: "" },
        rating: { type: Number, default: 0 },
        location: { type: String, default: "" },
        review: { type: String, default: "" },
        image: { type: String, default: "" },
      },
    ],
    section_title: { type: String, default: "" },
  },
  { _id: false }
);

const ContactUsSchema = new mongoose.Schema(
  {
    images: [{ type: String, default: "" }],
    section_title: { type: String, default: "" },
  },
  { _id: false }
);

const SettingsSchema = new mongoose.Schema(
  {
    social_media_links: [
      {
        platform: { type: String, required: true },
        icon: { type: String },
        link: { type: String },
        isHidden:{type:Boolean,default:false}
      },
    ],
    company_details: {
      company_mobile_number: { type: String, default: "" },
      company_email_id: { type: String, default: "" },
      company_address: { type: String, default: "" },
    },
  },
  { _id: false }
);

const HomePageSchema = new mongoose.Schema({
  structure_type: {
    type: String,
    required: true,
    enum: [
      "banner",
      "essence",
      "products",
      "product_made_for",
      "how_to_use",
      "benefits",
      "why_choose_us",
      "our_impact",
      "about_us",
      "our_wall_of_love",
      "contact_us",
      "settings",
    ],
  },
  content: {
    type: new mongoose.Schema(
      {
        banner: { type: BannerSchema, required: false },
        essence: { type: EssenceSchema, required: false },
        products: { type: ProductsSchema, required: false },
        product_made_for: { type: ProductMadeForSchema, required: false },
        how_to_use: { type: HowToUseSchema, required: false },
        benefits: { type: BenefitsSchema, required: false },
        why_choose_us: { type: WhyChooseUsSchema, required: false },
        our_impact: { type: OurImpactSchema, required: false },
        about_us: { type: AboutUsSchema, required: false },
        our_wall_of_love: { type: OurWallOfLoveSchema, required: false },
        contact_us: { type: ContactUsSchema, required: false },
        settings: { type: SettingsSchema, required: false },
      },
      { _id: false }
    ),
  },
});

const HomePageDataModel = mongoose.model("HomePage", HomePageSchema);

module.exports = {
  HomePageDataModel,
};
