require('dotenv').config()
const express=require('express')
const cors=require('cors')
const cookieParser=require('cookie-parser')
const connectDB=require('./config/db')
const authRouter = require('./features/auth/auth.routes')
const dashboardRouter=require('./features/dashboard/dashboard.routes')

const app=express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin:process.env.CLIENT_URL,
    credentials:true
}))

app.use('/api/auth', authRouter)
app.use('/api/dashboard', dashboardRouter)

const PORT=process.env.PORT
const startServer=async()=>{
    try{
        await connectDB()
        
        app.listen(PORT, ()=>{
            console.log(`Server running on port ${PORT}`)
        })
    }
    catch(err){
        console.log(err.message)
        process.exit(1)
    }
}
startServer()
