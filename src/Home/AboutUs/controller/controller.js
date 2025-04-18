const { HomePageDataModel } = require("../../model/model");


const getAboutUs = async (req, res) => {
  try {
    const data = await HomePageDataModel.findOne({
      structure_type: "about_us",
    });

    if (!data || !data.content.about_us) {
      return res.status(404).json({ message: "About Us section not found" });
    }

    res.status(200).json({
      data: data.content.about_us,
    });
  } catch (error) {
    console.error("Error fetching About Us data:", error);
    res.status(500).json({
      message: "Error fetching About Us data",
      error: error.message,
    });
  }
};

module.exports = {
  getAboutUs,
};
