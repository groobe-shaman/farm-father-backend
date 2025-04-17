const { HomePageDataModel } = require("../../model/model");

const getSettings = async (req, res) => {
    try {
      const settings = await HomePageDataModel.findOne({ structure_type: "settings" });
  
      if (!settings || !settings.content.settings) {
        return res.status(404).json({ message: "Settings section not found" });
      }
  
      res.status(200).json({
        data: settings.content.settings,
      });
    } catch (error) {
      console.error("Error fetching Settings data:", error);
      res.status(500).json({
        message: "Error fetching Settings data",
        error: error.message,
      });
    }
  };

module.exports = {
  getSettings,
};
