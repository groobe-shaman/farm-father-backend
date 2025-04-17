const express=require('express')
const { addEssenceHomepage, updateEssenceHomepage, getEssenceHomepage } = require('../controller/controller')
const { verifyAdminToken } = require('../../../Auth/middlewares/verifyAdminToken')
const router=express.Router()


router.post('/essence/',verifyAdminToken,addEssenceHomepage)
router.put('/essence/',verifyAdminToken,updateEssenceHomepage)
router.get('/essence/',verifyAdminToken,getEssenceHomepage)
module.exports=router