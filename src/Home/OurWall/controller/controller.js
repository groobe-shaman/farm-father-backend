const { HomePageDataModel } = require("../../model/model");

const getOurWallHomepage = async (req, res) => {
    try {
      const homePage = await HomePageDataModel.findOne({
        structure_type: "our_wall_of_love",
      });
      if (!homePage) {
        return res.status(404).json({
          success:false,
          message: "Our Wall of Love section not found",
        });
      }
  
      res.status(200).json({
        success:true,
        data: homePage.content.our_wall_of_love.data,
        section_title: homePage.content.our_wall_of_love.section_title,
      });
    } catch (error) {
      console.error("Error fetching our_wall_of_love data:", error);
      res.status(500).json({
        success:false,
        message: "Error fetching our_wall_of_love data",
        error: error.message,
      });
    }
  };
  module.exports = {
    getOurWallHomepage,
  };
  