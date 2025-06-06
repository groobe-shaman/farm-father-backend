const { HomePageDataModel } = require("../../model/model");

const getOurImpact = async (req, res) => {
    try {
      const impact = await HomePageDataModel.findOne({
        structure_type: "our_impact",
      });
      if (!impact || !impact.content.our_impact) {
        return res.status(404).json({
          success:false,
          message: "Our Impact section not found",
        });
      }
  
      res.status(200).json({
        success:true,
        data: impact.content.our_impact,
      });
    } catch (error) {
      console.error("Error fetching Our Impact data:", error);
      res.status(500).json({
        success:false,
        message: "Error fetching Our Impact data",
        error: error.message,
      });
    }
  };

  module.exports={
    getOurImpact
  }
