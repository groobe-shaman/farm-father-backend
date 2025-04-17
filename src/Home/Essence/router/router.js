const express=require('express')
const { getEssenceHomepage } = require('../controller/controller')
const router=express.Router()

router.get('/',getEssenceHomepage)

module.exports=router