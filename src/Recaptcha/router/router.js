const express=require('express')
const { verifyRecaptcha } = require('../controller/controller')
const router=express.Router()

router.post('/',verifyRecaptcha)

module.exports=router