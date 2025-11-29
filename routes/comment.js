import { Router } from "express";
import { Types } from "mongoose";
import { Comment } from "../model/comment.js";

const router=Router();

router.post('/api/comment/edit/:id',async (req,res)=>{
    const {content,updateComment}=req.body;
    if(!updateComment) res.sendStatus(400);
    const comment_id=new Types.ObjectId(`${req.params.id}`);
    const updatedComment= await Comment.findByIdAndUpdate(comment_id,{$set:{content}},{new:true});
    if(!updatedComment) res.sendStatus(500);
    res.sendStatus(200);
});

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

router.delete('/api/comment/delete/:id',async (req,res)=>{
  try{
    const comment_id=new Types.ObjectId(`${req.params.id}`);
    const deletedComment=await Comment.findByIdAndDelete(comment_id);
    if(!deletedComment) return res.sendStatus(400);
    return res.status(200).send({success:true});
  }catch(err){
    console.log(err);
    res.sendStatus(500);
  }

});
export default router