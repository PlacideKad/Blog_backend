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
    type:linkSchema
  },
},{strict:true,timestamps:true});

export const Stash=model('stash',stashSchema);
