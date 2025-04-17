const express=require('express')
const { addWhyChooseUs, updateWhyChooseUs, getWhyChooseUs } = require('../controller/controller')
const router=express.Router()

router.post("/whychooseus/",addWhyChooseUs)
router.put("/whychooseus/",updateWhyChooseUs)
router.get("/whychooseus/",getWhyChooseUs)

module.exports=router