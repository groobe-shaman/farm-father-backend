const express=require('express')
const { addOurWallHomepage, updateOurWallHomepage,getOurWallHomepage } = require('../controller/controller')
const router=express.Router()


router.post('/ourwall/',addOurWallHomepage)
router.put('/ourwall/',updateOurWallHomepage)
router.get('/ourwall/',getOurWallHomepage)

module.exports=router