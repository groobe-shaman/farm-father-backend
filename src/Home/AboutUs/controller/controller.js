const { HomePageDataModel } = require("../../model/model");


const getAboutUs = async (req, res) => {
  try {
    const data = await HomePageDataModel.findOne({
      structure_type: "about_us",
    });

    if (!data || !data.content.about_us) {
      return res.status(404).json({success:false, message: "About Us section not found" });
    }

    res.status(200).json({
      success:true,
      data: data.content.about_us,
    });
  } catch (error) {
    console.error("Error fetching About Us data:", error);
    res.status(500).json({
      success:false,
      message: "Error fetching About Us data",
      error: error.message,
    });
  }
};

module.exports = {
  getAboutUs,
};
