const express=require('express')
const { verifyAdminToken } = require('../../../Auth/middlewares/verifyAdminToken')
const { addAboutUs, updateAboutUs, getAboutUs, toggleSocialMediaVisibility } = require('../controller/controller')
const router=express.Router()

router.post("/aboutus/",verifyAdminToken,addAboutUs)
router.put("/aboutus/",verifyAdminToken,updateAboutUs)
router.get("/aboutus/",verifyAdminToken,getAboutUs)
router.post("/aboutus/toggleSocialMedia",verifyAdminToken,toggleSocialMediaVisibility)

module.exports=router