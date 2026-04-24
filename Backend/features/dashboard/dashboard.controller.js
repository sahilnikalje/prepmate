const Interview=require('../../models/Interview.model')

//todo STEP-1: Get all dashboard data for the logged in user
const getDashboardData=async(req,res)=>{
    try{
        const userId=req.user._id

     //todo STEP-2: Fetch all completed interviews for this user
        const interviews=await Interview.find({userId, status:'completed'}).sort({createdAt:-1})  //! newest first

     //todo STEP-3: Calculate stats from the interviews array
        const totalInterviews=interviews.length

     //todo Average score — add all scores and divide by count
        const averageScore=totalInterviews > 0 ? Math.round(
            interviews.reduce((sum, iv)=>sum+iv.score, 0)/totalInterviews
        )
        :0
    
     //todo Best score — find the highest score  
        const bestScore=totalInterviews>0 ? Math.max(...interviews.map((iv)=>iv.score)) : 0

     //todo STEP-4: Get only the 3 most recent interviews for the dashboard list
        const recentInterviews=interviews.slice(0,3).map((iv)=>(
            {
                id:iv._id,
                title:iv.title,
                company:iv.company,
                score:iv.score,
                data:iv.createdAt
            }
        ))

        res.status(200).json({
            success:true,
            stats:{
                totalInterviews,
                averageScore,
                bestScore
            },
            recentInterviews
        })
    }
    catch(err){
        console.log('getDashboardDataErr: ', err.message)
        res.status(500).json({success:false, message:err.message})
    }
}

module.exports={getDashboardData}