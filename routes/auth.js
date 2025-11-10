
//old routes
// '/api/auth/google'
// '/api/auth/google/callback'

// router.post('/api/user',async (req,res)=>{
//   const {id}=req.body;
//   const foundUser=await User.findOne({id:id});
//   if(!foundUser) return res.status(404).send({message:'No user found'});
//   return res.status(200).send(foundUser);
// });


import { Router } from "express";
import { User } from "../model/user.js";
import { getHashedPassword } from "../utils/hasher.js";

const router= Router();

//login signin and logout

router.post('/api/authenticate/signin',async (req,res)=>{
  let {body}=req;
  try{
    if(!body.password) return res.status(400).send({success:false,errorHandled:true,message:"Password fied empty cannot be processed"})
    body.password=await getHashedPassword(body?.password);
    const existingUser=await User.findOne({email:body.email},{_id:1},{lean:true});
    if(existingUser) return res.send({success:false,errorHandled:true,message:`A user with the email ${body.email} already exists`});

    const adminsList=[process.env.ADMIN_1_EMAIL,process.env.ADMIN_2_EMAIL];
    const newUser=new User({
      ...body,
      isAdmin:(adminsList.includes(body.email)),
      picture:'https://res.cloudinary.com/dmipesfyo/image/upload/c_fill,h_550,w_550/default_user_profile_picture',
    });
    const savedUser=await newUser.save();
    if(!savedUser) return res.status(500).send({success:false,errorHandled:true,message:'Unexpected error. User not created'});
    return res.send({success:true,savedUser});
  }catch(err){
    console.log(err);
    return res.sendStatus(500);
  }
});

// router.get('/api/logout',(req,res)=>{
//   // update if necessary
//   req.logout(()=>{
//     res.clearCookie('auth_token');
//     res.send({disconnected:true});
//   });
// })

export default router;