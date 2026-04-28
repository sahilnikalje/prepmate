const express=require('express')
const interviewRouter=express.Router()
const multer=require('multer')
const path=require('path')

const {createInterview, getInterview}=require('./interview.controller')
const protect=require('../../middlewares/auth.middleware')

const storage=multer.diskStorage({
    destination:(req, file, cb)=>{
        cb(null, 'uploads/')
    },
    filename:(req, file, cb)=>{
        const uniqueName=`${Date.now()}-${file.originalname}`
        cb(null, uniqueName)
    }
})

const fileFilter=(req, file, cb)=>{
    if(file.mimetype==='application/pdf'){
        cb(null, true) //! accept the file
    }
    else{
        cb(new Error('Only PDF files are allowed'), false) //! reject the file
    }
}

const upload=multer({
    storage,
    fileFilter,
    limits:{fileSize:5*1024*1024}, //! 5MB
})

interviewRouter.post('/', protect, upload.single('resume'), createInterview)
interviewRouter.get('/:id', protect, getInterview)

module.exports=interviewRouter