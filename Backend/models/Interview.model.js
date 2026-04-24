const mongoose=require('mongoose')

const interviewSchema=new mongoose.Schema({
    //todo Link interview to a user
    //todo ref: "User" means mongoose knows this id points to the User model

    userId:{type:mongoose.Schema.Types.ObjectId, ref:"User", required:true},
    title:{type:String, required:true},
    company:{type:String, required:true},
    score:{type:Number, default:0, min:0, max:100},
    jobDescription:{type:String, default:''},
    resumeText:{type:String, default:''},
    conversation:[{
        questions:{type:String},
        answer:{type:String}
    }],
    status:{type:String, enum:['completed', 'in-progress', 'abandoned'], default:'completed'}
},{
    timestamps:true
})

const Interview=mongoose.model('Interview', interviewSchema)

module.exports=Interview
