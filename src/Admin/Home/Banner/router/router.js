const express = require("express");
const {
  addBannerHomepage,
  updateHomepageBanner,
  getAllHomepageBanners,
  bannerVisibility,
} = require("../controller/controller");
const { verifyAdminToken } = require("../../../Auth/middlewares/verifyAdminToken");
const router = express.Router();

router.post("/banner/",verifyAdminToken, addBannerHomepage);
router.put("/banner/",verifyAdminToken, updateHomepageBanner);
router.get("/banner/",verifyAdminToken, getAllHomepageBanners);
router.post("/banner/updateBannerVisibility",verifyAdminToken,bannerVisibility);
module.exports = router;
