const express=require('express')
const { addOurWallHomepage, updateOurWallHomepage,getOurWallHomepage } = require('../controller/controller')
const { verifyAdminToken } = require('../../../Auth/middlewares/verifyAdminToken')
const router=express.Router()


router.post('/ourwall/',verifyAdminToken,addOurWallHomepage)
router.put('/ourwall/',verifyAdminToken,updateOurWallHomepage)
router.get('/ourwall/',verifyAdminToken,getOurWallHomepage)

module.exports=router