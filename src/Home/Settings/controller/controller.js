const { HomePageDataModel } = require("../../model/model");

const getSettings = async (req, res) => {
    try {
      const settings = await HomePageDataModel.findOne({ structure_type: "settings" });
  
      if (!settings || !settings.content.settings) {
        return res.status(404).json({success:false, message: "Settings section not found" });
      }
  
      res.status(200).json({
        success:true,
        data: settings.content.settings,
      });
    } catch (error) {
      console.error("Error fetching Settings data:", error);
      res.status(500).json({
        success:false,
        message: "Error fetching Settings data",
        error: error.message,
      });
    }
  };

module.exports = {
  getSettings,
};
