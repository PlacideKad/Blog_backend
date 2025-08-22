import {model , Schema} from 'mongoose';

export const commentSchema=new Schema({
  content:{
    type:String,
    validate:{
      validator:(value)=>/^[.\s\S]{3,}$/.test(value),
      message:'The given string is not a valid article summary'
    },
    required:true
  },
  author:{
    type:Schema.Types.ObjectId,
    ref:'user',
    required:true
  },
  parent:{
    type:Schema.Types.ObjectId,
    required:true,
    refPath:'parentModel',
  },
  parentModel:{
    type:String,
    required:true,
    enum:['article','comment']
  }
},{strict:true,timestamps:true});

export const Comment=model('comment',commentSchema);