const { HomePageDataModel } = require("../../../../Home/model/model");
const { ProductDataModel } = require("../../Product/model/model");

const addBannerHomepage = async (req, res) => {
  try {
    const { title, description } = req.body;
    let rawData = req.body.data;

    if (rawData) {
      rawData = Array.isArray(rawData) ? rawData : [rawData];
    }
    const transformedData = rawData
      ? rawData.map((id) => ({
          id: String(id),
          isHidden: false,
        }))
      : undefined;
    let homePage = await HomePageDataModel.findOne({
      structure_type: "banner",
    });
    if (homePage) {
      return res.status(400).json({
        message: "Cannot add banner structure again, instead update it",
      });
    }
    if (!homePage) {
      homePage = new HomePageDataModel({
        structure_type: "banner",
        content: { banner: { data: [], title: "", description: "" } },
      });
    }
      
       
   
    homePage.content.banner = {
      data: transformedData !== undefined ? transformedData : homePage.content.banner.data,
      title: title !== undefined ? title : homePage.content.banner.title,
      description:
        description !== undefined ? description : homePage.content.banner.description,
    };
    await homePage.save();

    res.status(201).json({
      message: "Banner data added successfully",
      data: homePage.content.banner,
    });
  } catch (error) {
    console.error("Error adding banner data:", error);
    res.status(500).json({
      message: "Error adding banner data",
      error: error.message,
    });
  }
};

const updateHomepageBanner = async (req, res) => {
  try {
    const { title, description } = req.body;
    let rawData = req.body.data;

    if (rawData) {
      rawData = Array.isArray(rawData) ? rawData : [rawData];
    }

    const transformedData = rawData
      ? rawData.map((id) => ({
          id: String(id),
          isHidden: false,
        }))
      : undefined;

    const homePage = await HomePageDataModel.findOne({
      structure_type: "banner",
    });
    if (!homePage) {
      return res.status(404).json({ message: "Banner section not found" });
    }

    if (transformedData !== undefined) {
      homePage.content.banner.data.push(...transformedData);
    }
    if (title !== undefined) {
      homePage.content.banner.title = title;
    }
    if (description !== undefined) {
      homePage.content.banner.description = description;
    }

    await homePage.save();

    res.status(200).json({
      message: "Banner data updated successfully",
      data: homePage.content.banner,
    });
  } catch (error) {
    console.error("Error updating banner data:", error);
    res.status(500).json({
      message: "Error updating banner data",
      error: error.message,
    });
  }
};

const bannerVisibility = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "ProductId is required" });
    }

    const homePage = await HomePageDataModel.findOne({
      structure_type: "banner",
    });
    if (!homePage) {
      return res.status(404).json({ message: "Banner section not found" });
    }

    const itemIndex = homePage.content.banner.data.findIndex(
      (item) => item.id === productId
    );

    if (itemIndex < 0) {
      return res.status(404).json({ message: "Banner item not found" });
    }

    homePage.content.banner.data[itemIndex].isHidden =
      !homePage.content.banner.data[itemIndex].isHidden;

    await homePage.save();

    res.status(200).json({
      message: "Banner visibility updated successfully",
      data: homePage.content.banner.data[itemIndex],
    });
  } catch (error) {
    console.error("Error updating banner visibility:", error);
    res.status(500).json({
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
      return res.status(404).json({ message: "Banner section not found" });
    }

    const productIds = homePage.content.banner.data.map((item) => item.id);

    if (productIds.length === 0) {
      return res.status(200).json({
        structure: "banner",
        data: [],
        title: homePage.content.banner.title,
        description: homePage.content.banner.description,
      });
    }

    const products = await ProductDataModel.find({
      _id: { $in: productIds },
    }).select("thumbnail_image main_image product_text_color");

    const data = homePage.content.banner.data
      .map((item) => {
        const product = products.find((p) => p._id.toString() === item.id);
        return product
          ? {
              thumbnail_image: product.thumbnail_image,
              banner_image: product.main_image,
              product_color: product.product_text_color,
              isHidden: item.isHidden,
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
    console.error("Error retrieving all banner data:", error);
    res.status(500).json({
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
