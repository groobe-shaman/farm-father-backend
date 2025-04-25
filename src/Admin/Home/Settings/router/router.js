const express=require('express')
const { verifyAdminToken } = require('../../../Auth/middlewares/verifyAdminToken')
const { addSettings, updateSettings, getSettings, toggleSocialMediaVisibility } = require('../controller/controller')
const router=express.Router()

router.post('/settings/',verifyAdminToken,addSettings)
router.put('/settings/',verifyAdminToken,updateSettings)
router.get('/settings/',verifyAdminToken,getSettings)
router.post('/settings/toggleSocialMedia',verifyAdminToken,toggleSocialMediaVisibility)
module.exports=router