import mongoose, { Schema, Types } from "mongoose";
import bcrypt from "bcrypt"
import jsonwebtoken from "jsonwebtoken";

const userSchma= new Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        index:true,


    },
    email:{
        type:String,
        required:true,
        trim:true,
        lowercase:true,
       
     
    },
    fullname:{
        type:String,
        required:true,
        trim:true,
        lowercase:true,
        index:true,
     
    },
    avatar:{
        type:String,
     
    },
    coverImg:{
        type:String,
        
    },
    password:{
        type:String,
        required:[true,'Password is require'],
        trim:true,
        select:false
    },
    watchhistory:{
        type:Schema.Types.ObjectId,
        ref:"Video"
    },
    refreshtoken:{
        type:String,
    }

},{
    timestamps:true,
})


// hash the password before saving the user model
userSchma.pre("save",async function (next) {
    if(!this.isModified("password")) return next();

    this.password= await bcrypt.hash(this.password,10);
    next();
    
}) 


// method to compare the password for login
userSchma.methods.isCorrect=async function (password) {
 return  await bcrypt.compare(password,this.password)   
}


// token expiry time
const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY || "15m";
const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY || "7d";


// method to generate access token 
userSchma.methods.generateAccessToken=function(){
    return jsonwebtoken.sign({
        _id:this.id,
        

    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn: ACCESS_TOKEN_EXPIRY
    }
)
}


// method to generate refresh token
userSchma.methods.generateRefreshToken=function(){
    return jsonwebtoken.sign({
        _id:this.id,
       
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn: REFRESH_TOKEN_EXPIRY,
    }
)
}
export const User=mongoose.model('User',userSchma)