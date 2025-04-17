const { HomePageDataModel } = require("../../model/model");

const getWhyChooseUs = async (req, res) => {
    try {
      const whyChooseUs = await HomePageDataModel.findOne({ structure_type: "why_choose_us" });
      if (!whyChooseUs || !whyChooseUs.content.why_choose_us) {
        return res.status(404).json({
          message: "Why Choose Us section not found",
        });
      }
  
      res.status(200).json({
        data: {
          structure: "why_choose_us",
          feature_titles: whyChooseUs.content.why_choose_us.feature_titles,
          feature_title_color: whyChooseUs.content.why_choose_us.feature_title_color,
          description: whyChooseUs.content.why_choose_us.description,
          image: whyChooseUs.content.why_choose_us.image,
          section_title: whyChooseUs.content.why_choose_us.section_title,
        },
      });
    } catch (error) {
      console.error("Error fetching Why Choose Us data:", error);
      res.status(500).json({
        message: "Error fetching Why Choose Us data",
        error: error.message,
      });
    }
  };
  
  module.exports={
      getWhyChooseUs
  }