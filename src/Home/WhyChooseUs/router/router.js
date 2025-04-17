const express=require('express')
const { getWhyChooseUs } = require('../controller/controller')
const router=express.Router()

router.get('/',getWhyChooseUs)

module.exports=router