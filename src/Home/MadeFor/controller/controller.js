const { HomePageDataModel } = require("../../model/model");

const getMadeForHomepage = async (req, res) => {
  try {
    const homePage = await HomePageDataModel.findOne({
      structure_type: "product_made_for",
    });
    if (!homePage) {
      return res.status(404).json({
        message: "Product made for section not found",
      });
    }

    res.status(200).json({
      data: homePage.content.product_made_for.data,
      section_title: homePage.content.product_made_for.section_title,
    });
  } catch (error) {
    console.error("Error fetching product_made_for data:", error);
    res.status(500).json({
      message: "Error fetching product_made_for data",
      error: error.message,
    });
  }
};

module.exports = {
  getMadeForHomepage,
};
