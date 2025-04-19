const { HomePageDataModel } = require("../../model/model");

const getHowToUseHomepage = async (req, res) => {
  try {
    const homePage = await HomePageDataModel.findOne({
      structure_type: "how_to_use",
    });
    if (!homePage) {
      return res.status(404).json({
        success:false,
        message: "How To Use section not found",
      });
    }

    res.status(200).json({
      success:true,
      data: homePage.content.how_to_use.data,
      section_title: homePage.content.how_to_use.section_title,
    });
  } catch (error) {
    console.error("Error fetching how_to_use data:", error);
    res.status(500).json({
      success:false,
      message: "Error fetching how_to_use data",
      error: error.message,
    });
  }
};
module.exports = {
  getHowToUseHomepage,
};
