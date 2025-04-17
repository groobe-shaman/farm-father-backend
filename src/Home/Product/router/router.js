const express=require('express')
const { getProductById, getHomepageProducts } = require('../controller/controller')

const router=express.Router()

router.get('/',getHomepageProducts)
router.get('/:productId',getProductById)

module.exports=router