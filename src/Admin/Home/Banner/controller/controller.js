const { HomePageDataModel } = require("../../../../Home/model/model");
const { BannerDataModel } = require("../../../Banners/model/model");
const { ProductDataModel } = require("../../Product/model/model");

const addBannerHomepage = async (req, res) => {
  try {
    const { data } = req.body;

    let rawData = data;
    if (rawData) {
      rawData = Array.isArray(rawData) ? rawData : [rawData];
    }
    const transformedData = rawData
      ? rawData.map((id) => ({
          id: String(id),
          isHidden: false,
        }))
      : [];

    let homePage = await HomePageDataModel.findOne({
      structure_type: "banner",
    });
    if (homePage) {
      return res.status(400).json({
        success:false,
        message: "Cannot add banner structure again, instead update it",
      });
    }
    if (!homePage) {
      homePage = new HomePageDataModel({
        structure_type: "banner",
        content: { banner: { data: [] } },
      });
    }

    homePage.content.banner.data = transformedData;
    await homePage.save();

    res.status(201).json({
      success:true,
      message: "Banner data added to homepage successfully",
      data: homePage.content.banner,
    });
  } catch (error) {
    console.error("Error adding banner data to homepage:", error);
    res.status(500).json({
      success:false,
      message: "Error adding banner data to homepage",
      error: error.message,
    });
  }
};

// Update Homepage Banner
const updateHomepageBanner = async (req, res) => {
  try {
    const { data } = req.body;

    let rawData = data;
    if (rawData) {
      rawData = Array.isArray(rawData) ? rawData : [rawData];
    }

    const transformedData = rawData
      ? rawData.map((id) => ({
          id: String(id),
          isHidden: false,
        }))
      : [];

    const homePage = await HomePageDataModel.findOne({
      structure_type: "banner",
    });
    if (!homePage) {
      return res.status(404).json({success:false, message: "Banner section not found" });
    }

    homePage.content.banner.data = transformedData;
    await homePage.save();

    res.status(200).json({
      success:true,
      message: "Banner data updated successfully",
      data: homePage.content.banner,
    });
  } catch (error) {
    console.error("Error updating banner data:", error);
    res.status(500).json({
      success:false,
      message: "Error updating banner data",
      error: error.message,
    });
  }
};

const bannerVisibility = async (req, res) => {
  try {
    const { bannerId } = req.body;

    if (!bannerId) {
      return res.status(400).json({success:false, message: "bannerId is required" });
    }

    const homePage = await HomePageDataModel.findOne({
      structure_type: "banner",
    });
    if (!homePage) {
      return res.status(404).json({success:false, message: "Banner section not found" });
    }

    const itemIndex = homePage.content.banner.data.findIndex(
      (item) => item.id === bannerId
    );

    if (itemIndex < 0) {
      return res.status(404).json({success:false, message: "Banner item not found" });
    }

    homePage.content.banner.data[itemIndex].isHidden =
      !homePage.content.banner.data[itemIndex].isHidden;

    await homePage.save();

    res.status(200).json({
      success:true,
      message: "Banner visibility updated successfully",
      data: homePage.content.banner.data[itemIndex],
    });
  } catch (error) {
    console.error("Error updating banner visibility:", error);
    res.status(500).json({
      success:false,
      message: "Error updating banner visibility",
      error: error.message,
    });
  }
};



const getAllHomepageBanners = async (req, res) => {
  try {
    const homePage = await HomePageDataModel.findOne({
      structure_type: "banner",
    });

    if (!homePage || !homePage.content.banner) {
      return res.status(404).json({ success: false, message: "Banner section not found" });
    }

    const bannerData = homePage.content.banner.data;

    const bannerIds = bannerData.map((item) => item.id);

    if (bannerIds.length === 0) {
      return res.status(200).json({
        success: true,
        structure: "banner",
        data: [],
        title: homePage.content.banner.title,
        description: homePage.content.banner.description,
      });
    }

    const banners = await BannerDataModel.find({
      _id: { $in: bannerIds },
    });

    const isHiddenMap = {};
    bannerData.forEach(item => {
      isHiddenMap[item.id.toString()] = item.isHidden || false;
    });

    const bannersWithVisibility = banners.map(banner => {
      return {
        ...banner.toObject(),
        isHidden: isHiddenMap[banner._id.toString()] || false,
      };
    });

    const sortedBanners = bannersWithVisibility.sort(
      (a, b) => (a.sort_id || 0) - (b.sort_id || 0)
    );

    res.status(200).json({
      success: true,
      structure: "banner",
      title: homePage.content.banner.title,
      description: homePage.content.banner.description,
      data: sortedBanners,
    });

  } catch (error) {
    console.error("Error retrieving all banner data:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving all banner data",
      error: error.message,
    });
  }
};

module.exports = {
  addBannerHomepage,
  updateHomepageBanner,
  bannerVisibility,
  getAllHomepageBanners,
};
