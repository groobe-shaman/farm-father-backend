const express=require('express')

const router=express.Router()

const { addContactUs, } = require('../controller/controller')

router.post('/',addContactUs)

module.exports=router