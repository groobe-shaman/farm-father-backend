const express=require('express')
const { getOurWallHomepage } = require('../controller/controller')
const router=express.Router()


router.get('/ourwall/',getOurWallHomepage)

module.exports=router