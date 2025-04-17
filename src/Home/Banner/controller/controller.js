const { BannerDataModel } = require("../../../Admin/Banners/model/model");
const { ProductDataModel } = require("../../../Admin/Home/Product/model/model");
const { HomePageDataModel } = require("../../model/model");

const getHomepageBanners = async (req, res) => {
  try {
    const homePage = await HomePageDataModel.findOne({
      structure_type: "banner",
    });
    if (!homePage || !homePage.content.banner) {
      return res.status(404).json({ message: "Banner section not found" });
    }

    const visibleBannerIds = homePage.content.banner.data
      .filter((item) => !item.isHidden)
      .map((item) => item.id);

    if (visibleBannerIds.length === 0) {
      return res.status(200).json({
        structure: "banner",
        data: [],
      });
    }

    const banners = await BannerDataModel.find({
      _id: { $in: visibleBannerIds },
    })

   

    res.status(200).json({
      structure: "banner",
      data:banners,
    });
  } catch (error) {
    console.error("Error retrieving banner data:", error);
    res.status(500).json({
      message: "Error retrieving banner data",
      error: error.message,
    });
  }
};

module.exports = {
  getHomepageBanners,
};
