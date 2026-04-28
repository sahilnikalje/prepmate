const mongoose=require('mongoose')

const interviewSchema=new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId, ref:'User', required:true},
    role:{type:String, required:true},
    category:{type:String, default:''},
    industry:{type:String, default:''},
    jobDescription:{type:String, default:''},
    resumePath:{type:String, default:''},
    resumeName:{type:String, default:''},
    conversation:[
        {
            question:{type:String},
            answer:{type:String}
        }
    ],
    status:{type:String, enum:['in-progress', 'completed', 'abandoned'], default:'in-progress'},
},{
    timestamps:true
})

const Interview=mongoose.model('Interview', interviewSchema)
module.exports=Interview