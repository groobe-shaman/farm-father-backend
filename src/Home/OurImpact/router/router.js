const express=require('express')
const { getOurImpact } = require('../controller/controller')
const router=express.Router()

router.get('/',getOurImpact)

module.exports=router