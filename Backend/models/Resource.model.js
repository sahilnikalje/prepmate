const mongoose=require('mongoose')

const resourceSchema=new mongoose.Schema({
    title:{type:String, required:true},
    category:{type:String, required:true},
    role:{type:String, default:'General'},
    difficulty:{type:String, enum:['Beginner', 'Intermediate', 'Advanced'], default:'Intermediate'},
    type:{type:String, enum:['Technical', 'Behavioral', 'Scenario', 'HR', 'Theory'], default:'Technical'},

    question:{type:String, required:true},
    answer:{type:String, required:true},
    explanation:{type:String, default:''},
    aiInsight:{type:String, default:''},

    tage:[{type:String}],
    duration:{type:String, default:'5 min'},
    externalLinks:[{label:String, url:String}],
    isFeatured:{type:Boolean, default:false},
    viewCount:{type:Number, default:0},
},{
    timestamps:true
})

module.exports=mongoose.model('Resource', resourceSchema)