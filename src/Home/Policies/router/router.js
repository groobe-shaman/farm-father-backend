const express=require('express')
const {  getPrivacyPolicy,  getCopyRightPolicy,getTermsAndConditions, getHelp } = require('../controller/controller')
const router=express.Router()

router.get("/privacypolicy/",getPrivacyPolicy)

router.get("/copyrightpolicy/",getCopyRightPolicy)

router.get("/termsandconditions/",getTermsAndConditions)

router.get("/help/",getHelp)
module.exports=router