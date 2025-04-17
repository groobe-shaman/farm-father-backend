const express=require('express')
const { addWhyChooseUs, updateWhyChooseUs, getWhyChooseUs } = require('../controller/controller')
const { verifyAdminToken } = require('../../../Auth/middlewares/verifyAdminToken')
const router=express.Router()

router.post("/whychooseus/",verifyAdminToken,addWhyChooseUs)
router.put("/whychooseus/",verifyAdminToken,updateWhyChooseUs)
router.get("/whychooseus/",verifyAdminToken,getWhyChooseUs)

module.exports=router