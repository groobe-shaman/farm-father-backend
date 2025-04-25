const { HomePageDataModel } = require("../../model/model");

// const getSettings = async (req, res) => {
//     try {
//       const settings = await HomePageDataModel.findOne({ structure_type: "settings" });
  
//       if (!settings || !settings.content.settings) {
//         return res.status(404).json({success:false, message: "Settings section not found" });
//       }
  
//       res.status(200).json({
//         success:true,
//         data: settings.content.settings,
//       });
//     } catch (error) {
//       console.error("Error fetching Settings data:", error);
//       res.status(500).json({
//         success:false,
//         message: "Error fetching Settings data",
//         error: error.message,
//       });
//     }
//   };

  const getSettings = async (req, res) => {
    try {
      const data = await HomePageDataModel.findOne({
        structure_type: "settings",
      }).lean()
  
      if (!data || !data.content.settings) {
        return res
          .status(404)
          .json({ success: false, message: "Settings section not found" });
      }
  
      const settings = data.content.settings;
      const filteredSocialMediaLinks = settings.social_media_links
      .filter(link => !link.isHidden)
      .map(({ platform, icon, link }) => ({ platform, icon, link }));
      
      const responseData = {
        company_details:data.content.settings.company_details,
        social_media_links: filteredSocialMediaLinks,
      };
  
      res.status(200).json({
        success: true,
        data: responseData,
      });
    } catch (error) {
      console.error("Error fetching settings data:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching settings data",
        error: error.message,
      });
    } 
  };

module.exports = {
  getSettings,
};
