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
const { verifyAdminToken } = require("../../../Auth/middlewares/verifyAdminToken");
router.post("/product/",verifyAdminToken,addProduct);
router.get("/product/",verifyAdminToken,getAllProducts);
router.delete("/product/",verifyAdminToken,deleteProduct);

router.post("/product/addHomePageProduct",verifyAdminToken,addProductsHomepage);
router.put("/product/updateHomePageProduct",verifyAdminToken, updateHomepageProducts);
router.post("/product/updateProductVisibility",verifyAdminToken, productsVisibility);
router.get("/product/getHomePageProducts",verifyAdminToken, getAllHomepageProducts);

router.get("/product/:productId",verifyAdminToken, getProductById);
router.put("/product/:productId",verifyAdminToken, updateProduct);
module.exports = router;
