import { Router } from "express";
import {User} from '../model/user.js';
import { Types } from "mongoose";

const router=Router();

//old route api/user
//used to return the decoded token to frontend 

router.patch('/api/user/updateinfos',async (req,res)=>{
  const data=req.body;
  const id=new Types.ObjectId(`${req.body.id}`);
  try{
    const updatedUser=await User.findByIdAndUpdate(id,{...data,id:undefined},{new:true,runValidators:true});
    if(!updatedUser) throw new Error('Error on update');
    res.status(200).send({updated:true,user:updatedUser});
  }catch(err){
    console.log(err);
    res.status(400).send({updated:false,message:`An error occured when updating the user ${data.id}`})
  }
});
export default router;