const express=require('express')
const { getMadeForHomepage } = require('../controller/controller')
const router=express.Router()

router.get('/',getMadeForHomepage)

module.exports=router