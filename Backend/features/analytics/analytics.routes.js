const express=require('express')
const protect=require('../../middlewares/auth.middleware')
const {getAnalyticsData}=require('./analytics.controller')

const analyticsRouter=express.Router()

analyticsRouter.get('/', protect, getAnalyticsData)

module.exports=analyticsRouter