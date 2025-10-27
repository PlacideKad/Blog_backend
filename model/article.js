import {model,Schema} from 'mongoose';
import { linkSchema } from './link.js';

const articleSchema=new Schema({
  title:{
    type:String,
    required:true,
    validate:{
      validator:(value)=>/^.{3,}$/.test(value),
      message:'The given string is not a valid article title'
    }
  },
  summary:{
    type:String,
    required:true,
    validate:{
      validator:(value)=>/^.{3,}$/.test(value),
      message:'The given string is not a valid article summary'
    }
  },
  content:{
    type:String,
    required:true,
    validate:{
      validator:(value)=>/^.{3,}$/.test(value),
      message:'The given string is not a valid article content'
    }
  },
  cover:{
    type:linkSchema,
    default:{link:"https://images.unsplash.com/photo-1623039405147-547794f92e9e?q=80&w=826&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"},
  },
  related_files:{
    type:[{
      title:String,
      file:linkSchema,
      display_name:String,
      format:String,
      resource_type:String
    }],
    default:[]
  },
  likes:{
    type:[{
      type:Schema.Types.ObjectId,
      refer:'user'
    }],
  },
  read:{
    type:[{
      type:Schema.Types.ObjectId,
      refer:'user'
    }],
  },
},{strict:true,timestamps:true});

export const Article=model('article',articleSchema);
