const express=require('express')
const { addEssenceHomepage, updateEssenceHomepage, getEssenceHomepage } = require('../controller/controller')
const router=express.Router()


router.post('/essence/',addEssenceHomepage)
router.put('/essence/',updateEssenceHomepage)
router.get('/essence/',getEssenceHomepage)
module.exports=router