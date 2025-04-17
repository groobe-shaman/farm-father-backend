const { HomePageDataModel } = require("../../model/model");

const getContactUsHomepage = async (req, res) => {
    try {
      const contactUs = await HomePageDataModel.findOne({ structure_type: "contact_us" });
      if (!contactUs || !contactUs.content.contact_us) {
        return res.status(404).json({
          message: "Contact Us section not found",
        });
      }
  
      res.status(200).json({
        data: {
          structure: "contact_us",
          images: contactUs.content.contact_us.images,
          section_title: contactUs.content.contact_us.section_title,
        },
      });
    } catch (error) {
      console.error("Error fetching Contact Us data:", error);
      res.status(500).json({
        message: "Error fetching Contact Us data",
        error: error.message,
      });
    }
  };
  
  module.exports={
      getContactUsHomepage
  }