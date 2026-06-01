const express=require('express')
const protect=require('../../middlewares/auth.middleware')
const{getSettings, updateSettings, changePassword, deleteAccount}=require('./settings.controller')

const settingsRouter=express.Router()

settingsRouter.get('/', protect, getSettings)
settingsRouter.put('/', protect, updateSettings)
settingsRouter.put('/change-password', protect, changePassword)
settingsRouter.delete('/delete-account', protect, deleteAccount)

module.exports=settingsRouter