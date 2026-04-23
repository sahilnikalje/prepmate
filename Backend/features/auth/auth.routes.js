const express=require('express')
const authRouter=express.Router()

const{register, login, logout, getMe}=require('./auth.controller')
const protect=require('../../middlewares/auth.middleware')

authRouter.post('/register', register)
authRouter.post('/login', login)
authRouter.post('/logout', logout)
authRouter.get('/me', protect, getMe)

module.exports=authRouter