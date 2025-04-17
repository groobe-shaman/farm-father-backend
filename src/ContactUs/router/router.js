const express=require('express')

const router=express.Router()

const { addContactUs, } = require('../controller/controller')
const { verifyAdminToken } = require('../../Admin/Auth/middlewares/verifyAdminToken')

router.post('/',addContactUs)

module.exports=router