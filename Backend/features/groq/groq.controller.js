const Groq=require('groq-sdk')
const Interview=require('../../models/Interview.model')

//todo STEP-1: Initialize Groq client using API key from .env
const groq=new Groq({apiKey:process.env.GROQ_API_KEY})

//todo STEP-2: Generate questions from resume + JD
//todo Called once when interview room loads
//todo Returns array of 5 questions tailored to the user's profile

const generateQuestions=async(req,res)=>{
    try{
        const {interviewId}=req.params

     //todo STEP-3: Get interview session from DB to read JD + role
        const interview=await Interview.findById(interviewId)
        if(!interview){
            return res.status(404).json({success:false, message:"Interview not found"})
        }

     //todo STEP-4: Build the prompt for Groq
     //todo We give it the role, JD so it generates relevant questions
    //    const prompt=`
    //       You are an expert technical interviewer.
    //       Generate exactly 5 interview questions for the following role and job description.
    //       Role:${interview.role}
    //       Category: ${interview.category}
    //       Industry: ${interview.industry}
    //       Job Description: ${interview.jobDescription || "Not provided"}

    //       Rules:
    //         - Mix behavioral and technical questions
    //         - Keep questions concise and clear
    //         - Make them relevant to the role and JD
    //         - Return ONLY a JSON array of 5 strings, nothing else
    //         - Example: ["Question 1", "Question 2", "Question 3", "Question 4", "Question 5"]
    //       `.trim()
const prompt=`
  You are an expert technical interviewer conducting a real job interview.
  Generate exactly 5 interview questions based STRICTLY on the job description below.

  Role: ${interview.role}
  Category: ${interview.category}
  Industry: ${interview.industry}
  Job Description: ${interview.jobDescription || "Not provided"}

  Rules:
  - Questions must be directly based on the job description above
  - Mix technical and behavioral questions relevant to this specific role
  - Ask about real skills, tools, and scenarios mentioned in the JD
  - Do NOT ask generic questions
  - Keep questions concise and conversational
  - Return ONLY a JSON array of 5 strings, nothing else
  - Example: ["Question 1", "Question 2", "Question 3", "Question 4", "Question 5"]
`.trim()
     //todo STEP-5: Call Groq API
        const completion=await groq.chat.completions.create({
            model:"llama-3.3-70b-versatile",
            messages:[{role:'user', content:prompt}],
            temperature:0.7
        })
     const raw=completion.choices[0].message.content.trim()

     //todo STEP-6: Parse the JSON array from Groq response
     //todo Strip markdown code blocks if Groq wraps in ```json

       const cleaned=raw.replace(/```json|```/g, "").trim()
       const questions=JSON.parse(cleaned)
    
     //todo STEP-7: Save questions to the interview document
       interview.questions=questions
       await interview.save()

       res.status(200).json({success:true, questions})
    }
    catch(err){
        console.error('generateQuestionsErr: ', err.message)
        res.status(500).json({success:false, message:'Failed to generate questions'})
    }
}

//todo STEP-8: Evaluate user's answer
//todo Returns: { quality: "good" | "weak", crossQuestion: string | null, score: number }

const evaluateAnswer=async(req,res)=>{
     try{
        const{question, answer, role}=req.body

        if(!answer || answer.trim().length<5){
            return res.status(200).json({
                quality:'weak',
                crossQuestion:'Could you elaborate more on that?',
                score:0
            })
        }
     
     //todo STEP-9: Ask Groq to evaluate the answer
        const prompt=`
                   You are an expert interviewer evaluating a candidate's answer.

                   Role:${role}
                   Question:${question}
                   Candidate's Answer:${answer}

                 Evaluate the answer and respond ONLY with a JSON object in this exact format:
                   {
                     "quality": "good" or "weak",
                     "score": a number from 0 to 100,
                     "crossQuestion": null if quality is good, or a follow-up question string if weak
                    }

                  Rules:
                   - "good" = answer is clear, relevant, and shows understanding
                   - "weak" = answer is vague, off-topic, or too short
                   - crossQuestion must be a natural follow-up to dig deeper
                   - Return ONLY the JSON object, no extra text
                `.trim()
        const completion=await groq.chat.completions.create({
            model:'llama-3.3-70b-versatile',
            messages:[{role:'user', content:prompt}],
            temperature:0.5
        })
        
        const raw=completion.choices[0].message.content.trim()
        const cleaned=raw.replace(/```json|```/g, "").trim()
        const result=JSON.parse(cleaned)

        res.status(200).json(result)
     }
     catch(err){
        console.error('evaluateAnswerErr: ', err.message)
        res.status(500).json({success:false, message:'Failed to evaluate answer'})
     }
}


//todo STEP-10: Save final interview results to MongoDB
//todo Called after all questions are done

const saveResults=async(req,res)=>{
    try{
        const {interviewId}=req.params
        const{conversation, finalScore}=req.body

        const interview=await Interview.findById(interviewId)
        if(!interview){
            return res.status(404).json({success:false, message:'Interview not found'})
        }

     //todo STEP-11: Save conversation + score + mark as completed
        interview.conversation=conversation
        interview.score=finalScore
        interview.status='completed'

        await interview.save()

     res.status(200).json({success:true, message:'Interview saved', score:finalScore})
    }
    catch(err){
        console.error('saveResultsErr: ', err.message)
        res.status(500).json({success:false, message:'Failed to save results'})
    }
}

module.exports={generateQuestions, evaluateAnswer, saveResults}