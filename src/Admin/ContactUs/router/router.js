const express=require('express')
const { getAllContactUs } = require('../controller/controller')

const router=express.Router()


//const { verifyAdminToken } = require('../../Auth/middlewares/verifyAdminToken')


//router to get all the contact us details for admin
router.get('/contactus/',getAllContactUs)

module.exports=router