const express=require('express')
const protect=require('../../middlewares/auth.middleware')
const{generateQuestions, evaluateAnswer, saveResults}=require('./groq.controller')

const groqRouter=express.Router()

groqRouter.get('/questions/:interviewId', protect, generateQuestions)
groqRouter.post('/evaluate', protect, evaluateAnswer)
groqRouter.post('/results/:interviewId', protect, saveResults)

module.exports=groqRouter