const express = require("express");
const router = express.Router();
const {
  addProduct,
  updateProduct,
  getAllProducts,
  deleteProduct,
  getProductById,
  addProductsHomepage,
  updateHomepageProducts,
  productsVisibility,
  getAllHomepageProducts,
} = require("../controller/controller");
router.post("/product/", addProduct);
router.get("/product/", getAllProducts);
router.delete("/product/", deleteProduct);

router.post("/product/addHomePageProduct", addProductsHomepage);
router.put("/product/updateHomePageProduct", updateHomepageProducts);
router.post("/product/updateProductVisibility", productsVisibility);
router.get("/product/getHomePageProducts", getAllHomepageProducts);

router.get("/product/:productId", getProductById);
router.put("/product/:productId", updateProduct);
module.exports = router;
