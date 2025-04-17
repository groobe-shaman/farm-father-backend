const express=require('express')
const { getHomepageBanners } = require('../controller/controller')
const router=express.Router()

router.get('/',getHomepageBanners)

module.exports=router