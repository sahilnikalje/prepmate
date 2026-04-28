const Interview=require('../../models/Interview.model')
const path=require('path')

//todo STEP-1: Create a new interview session
//todo Called when user clicks "Start Interview" on the Practice page

const createInterview=async(req,res)=>{
    try{
        const{role, category, industry, jobDescription}=req.body
        const userId=req.user._id

     //todo STEP-2: Validate required fields
        if(!role){
            return res.status(400).json({success:false, message:"Role is required"})
        }
        if(!req.file){
            return res.status(400).json({success:false, message:"Resume is required"})
        }
     //todo STEP-3: Save the interview session to MongoDB
     //todo resumePath stores where the file is saved on the server
     //todo Groq AI will read this file later to generate questions

      const interview=await Interview.create({
        userId,
        role,
        category:category || '',
        industry:industry || '',
        jobDescription:jobDescription || '',
        resumePath: req.file.path,
        resumeName:req.file.originalname,
        status:'in-progress',
      })

     //todo STEP-4: Return the interviewId to frontend
     //todo Frontend will navigate to /interview/:id using this

     res.status(201).json({
        success:true,
        message:'Interview session created',
        interviewId:interview._id,
     })
    }
    catch(err){
        console.log("createInterviewErr: ", err.message)
        res.status(500).json({success:false, message:"Something went wrong"})
    }
}

//todo STEP-4: Return the interviewId to frontend
//todo Frontend will navigate to /interview/:id using this

const getInterview=async(req,res)=>{
    try{
        const interview=await Interview.findById(req.params.id)

        if(!interview){
            return res.status(404).json({success:false, message:'interview not found'})
        }

     //todo STEP-6: Make sure user can only access their own interview
        if(interview.userId.toString() !==req.user._id.toString()){
            return res.status(403).json({success:false, message:"Not authorized"})
        }
        res.status(200).json({interview})
    }
    catch(err){
        console.log('getInterviewErr: ', err.message)
        res.status(500).json({success:false, message:"Something went wrong"})
    }
}

module.exports={createInterview, getInterview}