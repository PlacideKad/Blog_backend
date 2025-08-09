import {model , Schema} from 'mongoose';

export const commentSchema=new Schema({
  content:{
    type:String,
    validate:{
      validator:(value)=>/^.{3,}$/.test(value),
      message:'The given string is not a valid article summary'
    },
    required:true
  },
  author:{
    type:Schema.Types.ObjectId,
    ref:'user',
    required:true
  },
  article:{
    type:Schema.Types.ObjectId,
    ref:'article',
    required:true
  }
},{strict:true,timestamps:true});

export const Comment=model('comment',commentSchema);