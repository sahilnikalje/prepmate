const express=require('express')
const dashboardRouter=express.Router()
const {getDashboardData}=require('./dashboard.controller')
const protect=require('../../middlewares/auth.middleware')

dashboardRouter.get('/', protect, getDashboardData)

module.exports=dashboardRouter