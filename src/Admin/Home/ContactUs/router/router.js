const express=require('express')
const { addContactUsHomepage, updateContactUsHomepage, getContactUsHomepage } = require('../controller/controller')
const router=express.Router()

router.post('/home/contactus/',addContactUsHomepage,)
router.put('/home/contactus/',updateContactUsHomepage)
router.get('/home/contactus/',getContactUsHomepage)

module.exports=router