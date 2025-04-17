const express=require('express')
const { addMadeForHomepage, updateMadeForHomepage,getMadeForHomepage } = require('../controller/controller')
const router=express.Router()


router.post('/madefor/',addMadeForHomepage)
router.put('/madefor/',updateMadeForHomepage)
router.get('/madefor/',getMadeForHomepage)
module.exports=router