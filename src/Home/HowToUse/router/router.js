const express=require('express')
const { getHowToUseHomepage } = require('../controller/controller')
const router=express.Router()


router.get('/',getHowToUseHomepage)

module.exports=router