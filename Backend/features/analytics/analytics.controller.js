const Interview=require('../../models/Interview.model')

//todo STEP-1: Get all analytics data for the logged in user
//* We calculate everything from the completed interviews in MongoDB

const getAnalyticsData=async(req,res)=>{
    try{
        const userId=req.user._id

     //todo STEP-2: Fetch all completed interviews sorted oldest first
     //* Oldest first so performance chart shows progression over time
        const interviews=await Interview.find({
            userId,
            status:'completed'
        }).sort({createdAt:1})

        if(interviews.length===0){
            return res.status(200).json({
                success:true,
                totalInterviews:0,
                averageScore:0,
                bestScore:0,
                performanceData:[],
                strengths:[],
                growthAreas:[],
                miniMetrics:{totalSessions:0, questionsAnswered:0, improvement:0},
            })
        }

     //todo STEP-3: Calculate basic stats
        const totalInterviews=interviews.length
        const scores=interviews.map(iv=>iv.score)
        const averageScore=Math.round(scores.reduce((a,b)=>a+b, 0)/scores.length)
        const bestScore=Math.max(...scores)

     //todo STEP-4: Build performance chart data
     //* Each interview becomes one data point — date + score
        const performanceData=interviews.map(iv=>({
            label:new Date(iv.createdAt).toLocaleDateString('en-IN', {
                day:'2-digit',
                month:'short',
            }),
            score:iv.score
        }))

     //todo STEP-5: Calculate skill scores from conversation data
     //* We analyze each Q&A pair's individual score to find patterns
     //* Group by role to find strengths and weaknesses
        const roleScores={}
        interviews.forEach(iv=>{
            const role=iv.role || 'General'
            if(!roleScores[role]){
                roleScores[role]={scores:[], count:0}
            }
            roleScores[role].scores.push(iv.score)
            roleScores[role].count++
        })
     
      //todo STEP-6: Build strengths array — roles with avg score > 70
         const allRoleAverages=Object.entries(roleScores).map(([role, data])=>({
            role,
            avg:Math.round(data.scores.reduce((a,b)=>a+b, 0)/data.scores.length),
            count:data.count,
         })).sort((a,b)=>b.avg-a.avg)
        
        const strengths=allRoleAverages
                      .filter(r=>r.avg >= 60)
                      .slice(0,3)
                      .map((r, i)=>({
                         title:r.role,
                         score:r.avg,
                         sessions:r.count,
                         tag:r.avg >= 85 ? 'Expert Level' : r.avg >= 75 ? 'Strong' : 'Above Avg'
                      }))
     //todo STEP-7: Build growth areas — roles with avg score < 70
        const growthAreas=allRoleAverages
                      .filter(r=>r.avg < 60)
                      .slice(0,3)
                      .map(r=>({
                         title:r.role,
                         score:r.avg,
                         sessions:r.count,
                         insight:`You scored ${r.avg}% on average. Focus on improving your ${r.role} skills.`,
                      }))
    
    //todo STEP-8: Calculate improvement — compare first half vs second half of interviews
     let improvement=0
     if(interviews.length >= 2){
        const half=Math.floor(interviews.length/2)
        const firstHalf=scores.slice(0, half)
        const lastHalf=scores.slice(half)
        const firstAvg=firstHalf.reduce((a,b)=>a+b, 0)/firstHalf.length
        const lastAvg=lastHalf.reduce((a,b)=>a+b, 0)/lastHalf.length
        improvement=Math.round(lastAvg-firstAvg)
     }
    //todo STEP-9: Calculate total questions answered across all interviews
        const questionsAnswered=interviews.reduce((total, iv)=>{
            return total+(iv.conversation ? iv.conversation.length : 0)
        },0)
    
    //todo STEP-10: Build mini metrics
     const miniMetrics={
        totalSessions: totalInterviews,
        questionsAnswered,
        improvement: improvement>0 ? `+${improvement}%` : `${improvement}%`,
     }

    //todo STEP-11: Calculate overall AI insight score (weighted average)
      const recentScores=scores.slice(-5) //! last 5 interviews
      const insightScore=Math.round(
         recentScores.reduce((a,b)=>a+b, 0)/recentScores.length
      )
    const weeklyTrend=scores.length>=2
      ? Math.round(scores[scores.length-1]-scores[scores.length-2]) : 0

    const aiInsight={
        score:insightScore,
        trend:weeklyTrend > 0 ? `+${weeklyTrend}% from last session` : `${weeklyTrend}% from last session`,
        priority:growthAreas.length>0 ? growthAreas[0].title : 'Keep practicing',
        message:growthAreas.length>0
          ? `Your ${strengths[0]?.title || 'technical'} skills are strong, but ${growthAreas[0].title} needs more work. Focus on targeted practice in your next session.`
          : `Excellent progress! You are consistently improving. Keep up the momentum.`,
     }

     //todo STEP-12: Send everything
     res.status(200).json({
        success:true,
        totalInterviews,
        averageScore,
        bestScore,
        performanceData,
        strengths,
        growthAreas,
        aiInsight,
        miniMetrics,
     })
    }
    catch(err){
        console.error('getAnalyticsErr: ', err.message)
        res.status(500).json({success:false, message:err.message})
    }
}

module.exports={getAnalyticsData}