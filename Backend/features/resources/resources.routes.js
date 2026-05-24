const express=require('express')
const protect=require('../../middlewares/auth.middleware')
const {getResources,getResourceById,getCategoryCounts,getFeatured,}=require('./resources.controller')

const resourceRouter=express.Router()

resourceRouter.get('/',           protect, getResources)
resourceRouter.get('/featured',   protect, getFeatured)
resourceRouter.get('/categories', protect, getCategoryCounts)
resourceRouter.get('/:id',        protect, getResourceById)

module.exports = resourceRouter