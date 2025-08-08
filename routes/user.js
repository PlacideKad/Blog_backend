import { Router } from "express";
import jwt from 'jsonwebtoken';
import {User} from '../model/user.js';

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
  try{
    const url=req.query.url;
    const response=await fetch(url);
    const buffer=await response.arrayBuffer();
    res.setHeader('Content-Type','image/jpeg');
    res.send(Buffer.from(buffer));
  }catch(err){
    console.log(err);
    res.send(null);
  }
});

router.post('/api/user',async (req,res)=>{
  const {id}=req.body;
  const foundUser=await User.findOne({id:id});
  if(!foundUser) return res.status(404).send({message:'No user found'});
  return res.status(200).send(foundUser);
});

router.patch('/api/user/updateinfos',async (req,res)=>{
  const data=req.body;
  try{
    const updatedUser=await User.findOneAndUpdate({id:data.id},data,{new:true,runValidators:true});
    if(!updatedUser) throw new Error('Error on update');
    res.status(200).send({updated:true,user:updatedUser});
  }catch(err){
    console.log(err);
    res.status(400).send({updated:false,message:`An error occured when updating the user ${data.id}`})
  }
});
export default router;