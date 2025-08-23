import mongoose, {model,Schema} from 'mongoose';
import { linkSchema } from './link.js';

const stashSchema=new Schema({
  title:{
    type:String,
    validate:{
      validator:(value)=>/^.{3,}$/.test(value),
      message:'The given string is not a valid article title'
    }
  },
  summary:{
    type:String,
    validate:{
      validator:(value)=>/^.{3,}$/.test(value),
      message:'The given string is not a valid article summary'
    }
  },
  content:{
    type:String,
    validate:{
      validator:(value)=>/^.{3,}$/.test(value),
      message:'The given string is not a valid article content'
    }
  },
  from_article:{
    type:Schema.Types.ObjectId,
    ref:'article'
  },
  cover:{
    type:linkSchema,
    default:{link:"https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1973&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
  },
},{strict:true,timestamps:true});

export const Stash=model('stash',stashSchema);
