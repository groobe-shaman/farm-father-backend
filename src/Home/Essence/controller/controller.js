const { HomePageDataModel } = require("../../model/model");

const getEssenceHomepage = async (req, res) => {
    try {
      const homePage = await HomePageDataModel.findOne({
        structure_type: "essence",
      });
      if (!homePage) {
        return res.status(404).json({
          success:false,
          message: "Essence section not found",
        });
      }
  
      res.status(200).json({
        success:true,
        data: homePage.content.essence.data,
        section_title: homePage.content.essence.section_title,
      });
    } catch (error) {
      console.error("Error fetching essence data:", error);
      res.status(500).json({
        success:false,
        message: "Error fetching essence data",
        error: error.message,
      });
    }
  };


  module.exports={
    getEssenceHomepage
  }