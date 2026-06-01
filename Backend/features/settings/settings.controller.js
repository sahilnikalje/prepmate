const bcrypt=require('bcryptjs')
const User=require('../../models/User.model')
const Settings=require('../../models/Settings.model')
const Interview=require('../../models/Interview.model')
const Resource=require('../../models/Resource.model')

//todo Get settings
const getSettings=async(req,res)=>{
    try{
        const userId=req.user._id

        let settings=await Settings.findOne({userId})
        if(!settings){
            settings=await Settings.create({userId})
        }

     res.status(200).json({success:true, settings})
    }
    catch(err){
        console.error('getSettingsErr:', err.message)
        res.status(500).json({success:false, message:err.message})
    }
}

//todo Update settings
const updateSettings=async(req,res)=>{
    try{
        const userId=req.user._id
        const{voicePreference, theme, autoSave}=req.body

        if(voicePreference && !['female', 'male'].includes(voicePreference)){
            return res.status(400).json({success:false, message:'Invalid voice performance'})
        }
        if(theme && !['dark', 'light'].includes(theme)){
            return res.status(400).json({success:false, message:'Invalid theme'})
        }

        const settings=await Settings.findOneAndUpdate(
            {userId},
            {voicePreference, theme, autoSave},
            {new:true, upsert:true}
        )
     res.status(200).json({success:true, message:'Settings saved'})
    }
    catch(err){
        console.error('updateSettingsErr:', err.message)
        res.status(500).json({success:false, message:err.message})
    }
}

//todo Change password
const changePassword=async(req,res)=>{
    try{
        const userId=req.user._id
        const {currentPassword, newPassword}=req.body

        if(!currentPassword || !newPassword){
            return res.status(400).json({success:false, message:'All fields are required'})
        }
        if(newPassword.length<6){
            return res.status(400).json({success:false, message:'New password must be at least 6 characters'})
        }

     const user=await User.findById(userId).select('+password')
       if(!user){
         return res.status(404).json({success:false, message:'user not found'})
       }

     const isMatch=await bcrypt.compare(currentPassword, user.password)
        if(!isMatch){
            return res.status(400).json({success:false, message:'Current passwordis incorrect'})
        }
     
     const isSame=await bcrypt.compare(newPassword, user.password)
        if(isSame){
            return res.status(400).json({success:false, message:'New password must be different from current password'})
        }
    
     user.password=await bcrypt.hash(newPassword, 10)
     await user.save()

     res.status(200).json({success:true, message:'Password updated successfully'})
    }
    catch(err){
        console.error('changePasswordErr:', err.message)
        res.status(500).json({success:false, message:err.message})
    }
}

//todo Delete account
const deleteAccount=async(req,res)=>{
    try{
        const userId=req.user._id

        await Promise.all([
            Interview.deleteMany({userId}), //! all interviews
            Settings.findOneAndDelete({userId}), //! settings
            User.findByIdAndDelete(userId), //! user account
        ])
     
     //todo clear auth cookie
       res.cookie('token', '', {
         httpOnly:true,
         expires:new Date(0)
       })
     res.status(200).json({success:true, message:'Account deleted successfully'})
    }
    catch(err){
        console.error('deleteAccountErr: ', err.message)
        res.status(500).json({success:false, message:err.message})
    }
}

module.exports={getSettings, updateSettings, changePassword, deleteAccount}