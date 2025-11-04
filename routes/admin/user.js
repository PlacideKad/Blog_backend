import { Router } from "express";
import { User } from '../../model/user.js';
import { Types } from "mongoose";
import checkUserIsAdmin from "../../middleware/checkUserIsAdmin.js";

const router=Router();
// penser a rajouter un middleware d'authentification de l'admin
//penser a paginer le resultat
router.post('/api/admin/users',checkUserIsAdmin,async (req,res)=>{
  let {search,sort_by}=req.query;
  let order=parseInt(req.query.order);
  let exact=parseInt(req.query.exact);
  let regex=null;
  if(search){
    search=search.split(' ');
    regex=exact===1?new RegExp(`^${search}$`,"i"):new RegExp(`(${search.join("|")})`,"i");
  } 
  try{
    const foundUsers=await User.find(regex?{$or:[
      {given_name:regex},
      {family_name:regex},
      {email:regex}
    ]}:{},{id:0}).sort({[sort_by]:order});
    if(!foundUsers) res.status(400).send({message:'Error while fetching the users'});
    return regex? res.status(200).send({data:foundUsers}): res.status(200).send({data:foundUsers});
    
  }catch(err){
    console.log(err);
    return res.status(500);
  }
});

router.post('/api/admin/users/block',checkUserIsAdmin,async(req,res)=>{
  try{
    const id=new Types.ObjectId(`${req.body.user_id}`);
    const {isBlocked}=req.body;
    const updatedUser=await User.findByIdAndUpdate(id,{blocked:!isBlocked},{runValidators:true});
    if(!updatedUser) return res.status(400).send({message:'Error while blocking a user'});
    res.status(200).send({success:true});
  }catch(err){
    console.log(err);
    res.status(500);
  }
})

export default router;