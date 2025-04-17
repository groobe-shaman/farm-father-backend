const express = require("express");
const {
  addBannerHomepage,
  updateHomepageBanner,
  getAllHomepageBanners,
  bannerVisibility,
} = require("../controller/controller");
const router = express.Router();

router.post("/banner/", addBannerHomepage);
router.put("/banner/", updateHomepageBanner);
router.get("/banner/", getAllHomepageBanners);
router.post("/banner/updateBannerVisibility", bannerVisibility);
module.exports = router;
