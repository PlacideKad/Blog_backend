import { Types } from "mongoose";
import {User} from '../model/user.js';
const checkUserIsAdmin=async (req,res,next)=>{
  try{
    if(!req.body.admin_id) return res.status(403).send({message:"User requesting not identified"})
    const id=new Types.ObjectId(`${req.body.admin_id}`);
    const user=await User.findById(id,{isAdmin:1,_id:0});
    if(!user.isAdmin) return res.status(403).send({message:'User requesting is not an administrator'});
    next();
  }catch(err){
    console.log(err);
    return res.sendStatus(500);
  }
}
export default checkUserIsAdmin;