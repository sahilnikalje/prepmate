const User=require('../../models/User.model')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')

const generateTokenAndSetCookie=(res,userId)=>{
    const token=jwt.sign(
        {id:userId},
        process.env.JWT_SECRET,
        {expiresIn:'7d'}
    )

    res.cookie('token', token,{
        httpOnly:true,
        secure:process.env.NODE_ENV==='production',
        sameSite:'strict',
        maxAge: 7*24*60*1000
    })
}

const register=async(req,res)=>{
    try{
        const {name, email, password}=req.body

        const existingUser=await User.findOne({email})
        if(existingUser){
            return res.status(400).json({success:false, message:"User already exists"})
        }

        const hashedPassword=await bcrypt.hash(password, 10)
        const user=await User.create({
            name,
            email,
            password:hashedPassword
        })
        generateTokenAndSetCookie(res,user._id)
        res.status(201).json({
            success:true,
            message:'User registered successfully',
            user:{
                id:user._id,
                name:user.name,
                email:user.email
            }
        })
    }
    catch(err){
        console.log('registerErr: ', err.message)
        res.status(500).json({success:false, message:err.message})
    }
}

const login=async(req,res)=>{
    try{
        const{email, password}=req.body

        const user=await User.findOne({email})
        if(!user){
            return res.status(400).json({successs:false, message:"Invalid Credentials"})
        }
        const isMatch=await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.status(400).json({success:false, message:'Invalid Credentials'})
        }

        generateTokenAndSetCookie(res, user._id)

        res.status(200).json({
            success:true,
            message:'LoggedIn Successfully',
            user:{
                id:user._id,
                name:user.name,
                email:user.email
            }
        })
    }
    catch(err){
        console.log('loginErr: ', err.message)
        res.status(500).json({success:false, message:err.message})
    }
}

const logout=(req,res)=>{
    //* Overwrite the cookie with an empty value that expires immediately
    res.cookie('token', '', {
        httpOnly:true,
        expires:new Date(0)
    })
    res.status(200).json({success:true, message:'Logged out successfully'})
}

const getMe=async(req,res)=>{
    res.status(200).json({user:req.user})
}

module.exports={register, login, logout, getMe}
