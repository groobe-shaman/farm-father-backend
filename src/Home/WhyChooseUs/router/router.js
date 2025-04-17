const express=require('express')
const { getWhyChooseUs } = require('../controller/controller')
const router=express.ROuter()

router.get('/',getWhyChooseUs)

module.exports=router