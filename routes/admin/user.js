import { Router } from "express";
import { User } from '../../model/user.js';
import { Types } from "mongoose";

const router=Router();
// penser a rajouter un middleware d'authentification de l'admin
//penser a paginer le resultat
router.get('/api/admin/users',async (req,res)=>{
  try{
    const foundUsers=await User.find({},{id:0});
    if(!foundUsers) throw new Error('Error while fetching the users');
    res.status(200).send({foundUsers});
  }catch(err){
    console.log(err);
    res.status(500).send({error:err});
  }
});

router.post('/api/admin/users/block',async(req,res)=>{
  try{
    const id=new Types.ObjectId(`${req.body.user_id}`);
    const {isBlocked}=req.body;
    const updatedUser=await User.findByIdAndUpdate(id,{blocked:!isBlocked},{runValidators:true});
    if(!updatedUser) throw new Error('Error while blocking a user');
    res.status(200).send({success:true});
  }catch(err){
    console.log(err);
    res.status(500).send({error:err});
  }
})

export default router;