const { ProductDataModel } = require("../../../Admin/Home/Product/model/model");
const { HomePageDataModel } = require("../../model/model");

const getHomepageProducts= async (req, res) => {
    try {
        const homePage = await HomePageDataModel.findOne({
          structure_type: "products",
        });
        if (!homePage || !homePage.content.products) {
          return res.status(404).json({ message: "Products section not found" });
        }
    
        const visibleProductIds = homePage.content.products.data
          .filter((item) => !item.isHidden)
          .map((item) => item.id);
    
        if (visibleProductIds.length === 0) {
          return res.status(200).json({
            structure: "products",
            data: [],
            section_title: homePage.content.products.section_title,
          });
        }
    
        const products = await ProductDataModel.find({
          _id: { $in: visibleProductIds },
        }).select("highlight_media description title product_text_color");
    
        const data = homePage.content.products.data
          .filter((item) => !item.isHidden)
          .map((item) => {
            const product = products.find((p) => p._id.toString() === item.id);
            return product
              ? {
                higlight_media: product.highlight_media,
                description: product.description,
                title: product.title,
                product_text_color: product.product_text_color,
                }
              : null;
          })
          .filter((item) => item !== null);
    
        res.status(200).json({
          structure: "products",
          data,
          section_title: homePage.content.products.section_title,
        });
      } catch (error) {
        console.error("Error retrieving products data:", error);
        res.status(500).json({
          message: "Error retrieving products data",
          error: error.message,
        });
      }
  };

const getProductById = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await ProductDataModel.findById(productId).select(
      "-isDeleted -highlight_media -thumbnail_image -banner_image -main_image -_id -sort_id"
    );
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    return res.status(200).json({ success: true, product });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: `Error in fetching product by Id` });
  }
};

module.exports = {
  getProductById,
  getHomepageProducts
};
