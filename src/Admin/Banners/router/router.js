const express=require('express');
const { addBanner, updateBanner, getAllBanners, getBannerById } = require('../controller/controller');
const { verifyAdminToken } = require('../../Auth/middlewares/verifyAdminToken');
const router=express.Router()

router.post("/banner/",verifyAdminToken,addBanner);
router.put("/banner/",verifyAdminToken,updateBanner);
router.get("/banner/",verifyAdminToken,getAllBanners);
router.get("/banner/:banner_id",verifyAdminToken,getBannerById);

module.exports=router