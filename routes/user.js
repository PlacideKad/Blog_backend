import { Router } from "express";
import jwt from 'jsonwebtoken';

const router=Router();
router.get('/api/user',(req,res)=>{
  const token=req.cookies.auth_token;
  if(!token) return res.status(401).send({message:'Not authenticated',authenticated:false});
  try{
    const decoded=jwt.verify(token,process.env.JWT_SECRET);
    if(!decoded) throw new Error('Cookie expired');
    res.status(200).send({message:"Authenticated successfully!",authenticated:true,decoded})
  }catch(err){
    console.error(err);
    res.status(401).send({message:'Invalid cookie or cookie expired. Please try to reconnect',authenticated:false});
  }
});
router.get('/api/user/avatar',async (req,res)=>{
  const url=req.query.url;
  const response=await fetch(url);
  const buffer=await response.arrayBuffer();
  res.setHeader('Content-Type','image/jpeg');
  res.send(Buffer.from(buffer));
})
export default router;