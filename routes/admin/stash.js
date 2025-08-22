import { Router } from "express";
import { Stash } from "../../model/stash.js";

const router=Router();

router.post('/api/admin/stash',async (req,res)=>{
  const {body}=req;
  try{
    const newStash=new Stash(body);
    const savedStash=await newStash.save();
    if(!savedStash) throw new Error('Error occured when creating a new stash');
    return res.status(200).send({success:true});
  }catch(err){
    console.log(err);
    res.status(500).send({error:err,success:false});
  }
})
export default router