const express=require('express')
const { addHowToUseHomepage, updateHowToUseHomepage, getHowToUseHomepage } = require('../controller/controller')
const { verifyAdminToken } = require('../../../Auth/middlewares/verifyAdminToken')
const router=express.Router()


router.post('/howtouse/',verifyAdminToken,addHowToUseHomepage)
router.put('/howtouse/',verifyAdminToken,updateHowToUseHomepage)
router.get('/howtouse/',verifyAdminToken,getHowToUseHomepage)

module.exports=router