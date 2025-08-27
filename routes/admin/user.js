import { Router } from "express";
import { User } from '../../model/user.js';
import { Types } from "mongoose";

const router=Router();
// penser a rajouter un middleware d'authentification de l'admin
//penser a paginer le resultat
router.get('/api/admin/users',async (req,res)=>{
  let {search}=req.query;
  let regex=null;

  if(search){
    search=search.split(' ');
    regex=new RegExp(`\\b(${search.join("|")})\\b`,"i");
  } 
  try{
    const foundUsers=await User.find(regex?{$or:[
      {given_name:regex},
      {family_name:regex},
      {email:regex}
    ]}:{},{id:0});
    if(!foundUsers) throw new Error('Error while fetching the users');
    return regex? res.status(200).send({data:foundUsers}): res.status(200).send({foundUsers});
    // const data=foundUsers.filter(user=>(
    //   search.some(filter=>(
    //     user.given_name.toLowerCase().includes(filter.toLowerCase()) ||
    //     user.family_name.toLowerCase().includes(filter.toLowerCase()) ||
    //     user.email.toLowerCase().includes(filter.toLowerCase())
    //   ))
    // ));
    // return res.status(200).send({data});
    
  }catch(err){
    console.log(err);
    return res.status(500).send({error:err});
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