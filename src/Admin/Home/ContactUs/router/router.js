const express=require('express')
const { addContactUsHomepage, updateContactUsHomepage, getContactUsHomepage } = require('../controller/controller')
const { verifyAdminToken } = require('../../../Auth/middlewares/verifyAdminToken')
const router=express.Router()

router.post('/home/contactus/',verifyAdminToken,addContactUsHomepage,)
router.put('/home/contactus/',verifyAdminToken,updateContactUsHomepage)
router.get('/home/contactus/',verifyAdminToken,getContactUsHomepage)

module.exports=router