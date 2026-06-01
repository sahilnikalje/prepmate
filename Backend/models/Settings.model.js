const mongoose=require('mongoose')

const settingsSchema=new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId, ref:'User', required:true, unique:true},
    voicePreference:{type:String, enum:['female', 'male'], default:'female'},
    theme:{type:String, enum:['dark', 'light'], default:'dark'},
    autoSave:{type:Boolean, default:true},
},{
    timestamps:true
})

module.exports=mongoose.model('Settings', settingsSchema)
