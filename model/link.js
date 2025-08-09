import {Schema} from 'mongoose';

export const linkSchema=new Schema({
  link:{
    type:String,
    validate:{
      validator:(value)=>/^(https:\/\/).+$/.test(value),
      message:'The given string is not a valid link'
    }
  }
});