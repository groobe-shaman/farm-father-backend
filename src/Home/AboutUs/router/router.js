const express=require('express')
const { getAboutUs } = require('../controller/controller')
const router=express.Router()

router.get("/",getAboutUs)

module.exports=router