const express=require('express')
const { verifyAdminToken } = require('../../../Auth/middlewares/verifyAdminToken')
const { addPrivacyPolicy, updatePrivacyPolicyDetails, getPrivacyPolicy, addCopyRightPolicy, updateCopyRightPolicyDetails, getCopyRightPolicy, addTermsAndConditions, updateTermsAndCOnditionDetails, getTermsAndConditions, addHelp, updateHelpDetails, getHelp } = require('../controller/controller')
const router=express.Router()

router.post("/privacypolicy/",verifyAdminToken,addPrivacyPolicy)
router.put("/privacypolicy/",verifyAdminToken,updatePrivacyPolicyDetails)
router.get("/privacypolicy/",verifyAdminToken,getPrivacyPolicy)

router.post("/copyrightpolicy/",verifyAdminToken,addCopyRightPolicy)
router.put("/copyrightpolicy/",verifyAdminToken,updateCopyRightPolicyDetails)
router.get("/copyrightpolicy/",verifyAdminToken,getCopyRightPolicy)

router.post("/termsandconditions/",verifyAdminToken,addTermsAndConditions)
router.put("/termsandconditions/",verifyAdminToken,updateTermsAndCOnditionDetails)
router.get("/termsandconditions/",verifyAdminToken,getTermsAndConditions)

router.post("/help/",verifyAdminToken,addHelp)
router.put("/help/",verifyAdminToken,updateHelpDetails)
router.get("/help/",verifyAdminToken,getHelp)
module.exports=router