const express=require('express')
const { verifyAdminToken } = require('../../../Auth/middlewares/verifyAdminToken')
const { addOurImpact, updateOurImpact, getOurImpact } = require('../controller/controller')
const router=express.Router()

router.post('/ourimpact/',verifyAdminToken,addOurImpact)
router.put('/ourimpact/',verifyAdminToken,updateOurImpact)
router.get('/ourimpact/',verifyAdminToken,getOurImpact)

module.exports=router