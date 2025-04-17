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

    const visibleProductIds = homePage.content.banner.data
      .filter((item) => !item.isHidden)
      .map((item) => item.id);

    if (visibleProductIds.length === 0) {
      return res.status(200).json({
        structure: "banner",
        data: [],
        title: homePage.content.banner.title,
        description: homePage.content.banner.description,
      });
    }

    const products = await ProductDataModel.find({
      _id: { $in: visibleProductIds },
    }).select("thumbnail_image banner_image product_text_color");

    const data = homePage.content.banner.data
      .filter((item) => !item.isHidden)
      .map((item) => {
        const product = products.find((p) => p._id.toString() === item.id);
        return product
          ? {
              thumbnail_image: product.thumbnail_image,
              banner_image: product.banner_image,
              product_color: product.product_text_color,
            }
          : null;
      })
      .filter((item) => item !== null);

    res.status(200).json({
      structure: "banner",
      data,
      title: homePage.content.banner.title,
      description: homePage.content.banner.description,
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
