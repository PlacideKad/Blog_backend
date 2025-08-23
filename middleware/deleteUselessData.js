import {Comment} from '../model/comment.js';
import { Types } from 'mongoose';
export const deleteComments=async (req,res,next)=>{
  const article_id=new Types.ObjectId(`${req.body.id}`);
  try{
    const result=await Comment.deleteMany({parent:article_id,parentModel:'article'});
    if(!result.acknowledged) throw new Error('Error while deleting the comments linked to an article');
    next();
  }catch(err){
    console.log(err);
    return res.send({error:err});
  }
}