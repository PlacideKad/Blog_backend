import { Router } from "express";
import jwt from 'jsonwebtoken';

const router=Router();
router.get('/api/user',(req,res)=>{
  const token=req.cookies.auth_token;
  if(!token) return res.status(401).send({message:'Not authenticated',authenticated:false});
  try{
    const decoded=jwt.verify(token,process.env.JWT_SECRET);
    if(!decoded) throw new Error('Cookie expired');
    res.status(200).send({message:"Authenticated successfully!",authenticated:true})
  }catch(err){
    console.error(err);
    res.status(401).send({message:'Invalid cookie or cookie expired. Please try to reconnect',authenticated:false});
  }

})
export default router;