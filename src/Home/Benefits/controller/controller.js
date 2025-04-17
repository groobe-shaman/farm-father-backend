const { HomePageDataModel } = require("../../model/model");

const getBenefits = async (req, res) => {
    try {
      const benefits = await HomePageDataModel.findOne({ structure_type: "benefits" });
      if (!benefits || !benefits.content.benefits) {
        return res.status(404).json({
          success:false,
          message: "Benefits section not found",
        });
      }
  
      res.status(200).json({
        success:true,
        data: {
          image: benefits.content.benefits.image,
          section_title: benefits.content.benefits.section_title,
        },
      });
    } catch (error) {
      console.error("Error fetching benefits data:", error);
      res.status(500).json({
        success:false,
        message: "Error fetching benefits data",
        error: error.message,
      });
    }
  };
module.exports = {
  getBenefits
};