const express=require('express')
const { getOurWallHomepage } = require('../controller/controller')
const router=express.Router()


router.get('/',getOurWallHomepage)

module.exports=router