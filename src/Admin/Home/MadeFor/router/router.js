const express=require('express')
const { addMadeForHomepage, updateMadeForHomepage,getMadeForHomepage } = require('../controller/controller')
const { verifyAdminToken } = require('../../../Auth/middlewares/verifyAdminToken')
const router=express.Router()


router.post('/madefor/',verifyAdminToken,addMadeForHomepage)
router.put('/madefor/',verifyAdminToken,updateMadeForHomepage)
router.get('/madefor/',verifyAdminToken,getMadeForHomepage)
module.exports=router