const express = require("express");
const {
  addBannerHomepage,
  updateHomepageBanner,
  getAllHomepageBanners,
  bannerVisibility,
} = require("../controller/controller");
const { verifyAdminToken } = require("../../../Auth/middlewares/verifyAdminToken");
const router = express.Router();

router.post("/home/banner/",verifyAdminToken, addBannerHomepage);
router.put("/home/banner/",verifyAdminToken, updateHomepageBanner);
router.get("/home/banner/",verifyAdminToken, getAllHomepageBanners);
router.post("/home/banner/updateBannerVisibility",verifyAdminToken,bannerVisibility);
module.exports = router;
