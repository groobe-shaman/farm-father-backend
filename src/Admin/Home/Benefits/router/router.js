const express=require('express')
const { addBenefits, updateBenefits, getBenefits } = require('../controller/controller')
const router=express.Router()

router.post('/benefits/',addBenefits)
router.put('/benefits/',updateBenefits)
router.get('/benefits/',getBenefits)

module.exports=router