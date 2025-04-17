const express=require('express')
const { addBenefits, updateBenefits, getBenefits } = require('../controller/controller')
const { verifyAdminToken } = require('../../../Auth/middlewares/verifyAdminToken')
const router=express.Router()

router.post('/benefits/',verifyAdminToken,addBenefits)
router.put('/benefits/',verifyAdminToken,updateBenefits)
router.get('/benefits/',verifyAdminToken,getBenefits)

module.exports=router