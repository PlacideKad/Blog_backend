import mongoose, {model,Schema} from 'mongoose';
import { linkSchema } from './link.js';

const stashSchema=new Schema({
  title:{
    type:String
  },
  summary:{
    type:String
  },
  content:{
    type:String
  },
  from_article:{
    type:Schema.Types.ObjectId,
    ref:'article' 
  },
  cover:{
    type:linkSchema,
    default:{link:"https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1973&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
  },
  related_files:{
    type:[{
      title:String,
      file:linkSchema,
      display_name:String,
      format:String
    }],
    default:[]
  },
},{strict:true,timestamps:true});

export const Stash=model('stash',stashSchema);
