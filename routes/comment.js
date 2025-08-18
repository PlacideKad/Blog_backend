import { Router } from "express";
import { Types } from "mongoose";
import { Comment } from "../model/comment.js";

const router=Router();
// Add an authentication middleware
router.post('/api/comment',async (req,res)=>{
  try{
    const {content,author_id,parent_id,parentModel}=req.body;
    const author=new Types.ObjectId(`${author_id}`);
    const parent=new Types.ObjectId(`${parent_id}`);
    const newComment=new Comment({author,parent,content,parentModel});
    const savedComment=await newComment.save();
    if(!savedComment) throw new Error('Error occured when creating a new comment');
    return res.sendStatus(201);

  }catch(err){
    console.log(err);
    res.sendStatus(400);
  }
});

export default router