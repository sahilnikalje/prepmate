const Groq = require('groq-sdk')
const Interview = require('../../models/Interview.model')
const fs = require('fs')
const path = require('path')

//todo STEP-1: Initialize Groq client using API key from .env
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

//todo STEP-2: Generate questions from resume + JD
//todo Called once when interview room loads
//todo Returns array of 7 questions tailored to the user's profile

const generateQuestions = async (req, res) => {
    try {
        const { interviewId } = req.params

        //todo STEP-3: Get interview session from DB to read JD + role
        const interview = await Interview.findById(interviewId)
        if (!interview) {
            return res.status(404).json({ success: false, message: "Interview not found" })
        }

        // Try to read resume text if available
        let resumeText = ''
        if (interview.resumePath && fs.existsSync(interview.resumePath)) {
            try {
                // Read file as binary — for plain text resumes; PDF parsing would need extra lib
                const ext = path.extname(interview.resumePath).toLowerCase()
                if (ext === '.txt') {
                    resumeText = fs.readFileSync(interview.resumePath, 'utf8').substring(0, 3000)
                }
            } catch (e) {
                // Silently skip resume read errors
            }
        }

        //todo STEP-4: Build the prompt for Groq
        //todo We give it the role, JD, and resume so it generates relevant questions
        const prompt = `
You are a senior technical interviewer conducting a real job interview.
Generate exactly 7 interview questions for the candidate below.

Role: ${interview.role}
Category: ${interview.category}
Industry: ${interview.industry}
Job Description: ${interview.jobDescription || "Not provided"}
${resumeText ? `Resume Content (partial): ${resumeText}` : ''}

STRICT QUESTION DISTRIBUTION RULES:
- 3 questions: Core theory / concept questions for the role (e.g., "What is the difference between REST and GraphQL?", "Explain closures in JavaScript", "What is ACID in databases?")
- 2 questions: Technical / practical questions based on skills or technologies in JD or resume (e.g., "How does React's reconciliation algorithm work?", "When would you use useCallback vs useMemo?")
- 1 question: Project-based question (e.g., "Walk me through the most challenging project you've built")
- 1 question: Problem-solving or architecture question (e.g., "How would you design a URL shortener?")

RULES:
- DO NOT ask behavioral or scenario-based questions like "Tell me about a time when..."
- DO NOT make every question open-ended or story-based
- Questions must be specific to the role and technologies mentioned
- Questions should feel like a real technical interview, not an HR screening
- Keep questions concise, clear, and direct
- Return ONLY a JSON array of 7 strings, nothing else
- Example: ["Question 1", "Question 2", ..., "Question 7"]
`.trim()

        //todo STEP-5: Call Groq API
        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.6
        })
        const raw = completion.choices[0].message.content.trim()

        //todo STEP-6: Parse the JSON array from Groq response
        //todo Strip markdown code blocks if Groq wraps in ```json
        const cleaned = raw.replace(/```json|```/g, "").trim()
        const questions = JSON.parse(cleaned)

        //todo STEP-7: Save questions to the interview document
        interview.questions = questions
        await interview.save()

        res.status(200).json({ success: true, questions })
    }
    catch (err) {
        console.error('generateQuestionsErr: ', err.message)
        res.status(500).json({ success: false, message: 'Failed to generate questions' })
    }
}

//todo STEP-8: Evaluate user's answer
//todo Returns: { quality: "good" | "weak", feedback: string, crossQuestion: string | null, score: number }

const evaluateAnswer = async (req, res) => {
    try {
        const { question, answer, role } = req.body

        if (!answer || answer.trim().length < 5) {
            return res.status(200).json({
                quality: 'weak',
                feedback: "I didn't catch that. Could you elaborate?",
                crossQuestion: 'Could you elaborate more on that?',
                score: 0
            })
        }

        //todo STEP-9: Ask Groq to evaluate the answer
        const prompt = `
You are an expert interviewer evaluating a candidate's answer during a live technical interview.

Role: ${role}
Question: ${question}
Candidate's Answer: ${answer}

Evaluate the answer and respond ONLY with a JSON object in this EXACT format:
{
  "quality": "good" or "weak",
  "score": a number from 0 to 100,
  "feedback": "One short conversational sentence (max 8 words). Examples: 'Good explanation.', 'Solid understanding of the concept.', 'Nice approach.', 'Good answer.', 'Clear and well-structured.' — NO long paragraphs.",
  "crossQuestion": null
}

RULES:
- "good" = answer is clear, relevant, and demonstrates real understanding
- "weak" = answer is vague, off-topic, incomplete, or too short (less than 2 meaningful sentences)
- crossQuestion: set to null for EVERY answer. Do NOT generate follow-up questions.
- feedback must be SHORT (max 8 words), warm, and conversational — like a real interviewer
- Return ONLY the JSON object, no extra text
`.trim()

        const completion = await groq.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.4
        })

        const raw = completion.choices[0].message.content.trim()
        const cleaned = raw.replace(/```json|```/g, "").trim()
        const result = JSON.parse(cleaned)

        // Always set crossQuestion to null — follow-up logic is handled on frontend
        result.crossQuestion = null

        res.status(200).json(result)
    }
    catch (err) {
        console.error('evaluateAnswerErr: ', err.message)
        res.status(500).json({ success: false, message: 'Failed to evaluate answer' })
    }
}


//todo STEP-10: Save final interview results to MongoDB
//todo Called after all questions are done

const saveResults = async (req, res) => {
    try {
        const { interviewId } = req.params
        const { conversation, finalScore } = req.body

        const interview = await Interview.findById(interviewId)
        if (!interview) {
            return res.status(404).json({ success: false, message: 'Interview not found' })
        }

        //todo STEP-11: Save conversation + score + mark as completed
        interview.conversation = conversation
        interview.score = finalScore
        interview.status = 'completed'

        await interview.save()

        res.status(200).json({ success: true, message: 'Interview saved', score: finalScore })
    }
    catch (err) {
        console.error('saveResultsErr: ', err.message)
        res.status(500).json({ success: false, message: 'Failed to save results' })
    }
}

module.exports = { generateQuestions, evaluateAnswer, saveResults }