const express=require('express')
const { getBenefits } = require('../controller/controller')
const router=express.Router()

router.get('/',getBenefits)

module.exports=router