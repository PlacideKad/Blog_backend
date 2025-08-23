import { Router } from "express";
import { Stash } from "../../model/stash.js";
import { Types } from "mongoose";

const router=Router();

router.post('/api/admin/stash',async (req,res)=>{
  const {body}=req;
  try{
    if(body.stash_id){
      const id=new Types.ObjectId(`${body.stash_id}`);
      const updatedStash= await Stash.findByIdAndUpdate(id,{...body,stash_id:undefined});
      if(!updatedStash) throw new Error('Error when updating a stashed work');
      return res.status(200).send({success:true});
    }else{
      const newStash=new Stash(body);
      const savedStash=await newStash.save();
      if(!savedStash) throw new Error('Error occured when creating a new stash');
      return res.status(201).send({success:true});
    }
  }catch(err){
    console.log(err);
    res.status(400).send({error:err,success:false});
  }
});

router.get('/api/admin/stashes',async (req,res)=>{
  try{
    const stashes=await Stash.find();
    if (!stashes) throw new Error('Error occured when retrieving stashes from the database');
    return res.send(stashes);
  }catch(err){
    console.log(err);
    res.status(500).send({error:err});
  }
});

router.get('/api/admin/stashes/:id',async(req,res)=>{
  const id=new Types.ObjectId(`${req.params.id}`);
  try{
    const stash=await Stash.findById(id);
    if(!stash) throw new Error('Error occured when fetching the stash data');
    res.status(200).send({stash});
  }catch(err){
    console.log(err);
    res.status(400).send({error:err});
  }
});

export default router