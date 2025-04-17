const express=require('express')
const { getSettings } = require('../controller/controller')
const router=express.Router()

router.get('/',getSettings)

module.exports=router