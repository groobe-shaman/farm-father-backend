const express=require('express')
const { getContactUsHomepage } = require('../controller/controller')
const router=express.Router()

router.get('/',getContactUsHomepage)

module.exports=router