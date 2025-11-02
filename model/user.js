import { Schema , Types, model } from "mongoose";

const userSchema=new Schema({
  given_name:{
    type:String,
    required:true,
    trim:true,
    validate:{
      validator:(value)=>/^[\w]{3,15}$/.test(value),
      message:'The given string is not a valid user name'
    }
  },
  family_name:{
    type:String,
    required:true,
    trim:true,
    validate:{
      validator:(value)=>/^[\w]{3,15}$/.test(value),
      message:'The given string is not a valid user middlename'
    }
  },
  email:{
    type:String,
    required:true,
    unique:true,
    trim:true,
    validate:{
      validator:(value)=>/^[a-z][a-z0-9]{1,20}@[a-zA-Z]{1,8}(\.[a-z]{1,10}){1,2}$/.test(value),
      message:'The given string is not a valid email address'
    }
  },
  picture:{
    type:String,
    required:true,
    trim:true,
    validate:{
      validator:(value)=>/^(https:\/\/).+$/.test(value),
      message:'The given string is not a valid url to the profile picture'
    }
  },
  id:{
    type:String,
    required:true,
    unique:true,
  },
  blocked:{
    type:Boolean,
    default:false
  },
  isAdmin:{
    type:Boolean,
    default:false
  }
},{strict:true,timestamps:true});

export const User=model('user',userSchema);
