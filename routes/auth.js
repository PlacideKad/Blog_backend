import { Router } from "express";
import { User } from "../model/user.js";
import { getHashedPassword , checkPassword} from "../utils/hasher.js";
import { Types } from "mongoose";

const router= Router();

router.post('/api/authenticate/signup',async (req,res)=>{
  let {body}=req;
  try{
    if(!body.password) return res.status(400).send({success:false,errorHandled:true,message:"Password fied empty cannot be processed"})
    body.password=await getHashedPassword(body?.password);
    const existingUser=await User.findOne({email:body.email},{_id:1},{lean:true});
    if(existingUser) return res.send({success:false,errorHandled:true,message:`A user with the email ${body.email} already exists. Please, signin to your account.`});

    const adminsList=[process.env.ADMIN_1_EMAIL,process.env.ADMIN_2_EMAIL];
    const newUser=new User({
      ...body,
      isAdmin:(adminsList.includes(body.email)),
      picture:'https://res.cloudinary.com/dmipesfyo/image/upload/c_fill,h_550,w_550/default_user_profile_picture',
    });
    const savedUser=await newUser.save();
    if(!savedUser) return res.status(500).send({success:false,errorHandled:true,message:'Unexpected error. User not created'});
    req.session.userId=savedUser._id;
    res.session.save(err=>{
      if(err) throw new Error("Not signed in");
      return res.send({success:true,user:savedUser});
    })
  }catch(err){
    console.log(err);
    return res.status(500).send({success:false, errorHandled:false, message:err});
  }
});

router.post("/api/authenticate/signin",async (req,res)=>{
  try{
    const {email, password}=req.body;
    if(!(email && password)) return res.status(400).send({success:false, errorHandled:true, message:"Missing email or password. Check yout input, then submit again"});
    const foundUser=await User.findOne({email:email},{},{lean:true});
    if(!foundUser) return res.status(400).send({success:false, errorHandled:true, message:`No user with the email ${email} found. Please, sign up first.`});
    if(!await checkPassword(password,foundUser.password)) return res.status(401).send({success:false, errorHandled:true, message:"Email or password might be incorrect. Please check your entries"});
    req.session.userId=foundUser._id;
    req.session.save(err=>{
      if(err) throw new Error("Not logged In");
      return res.status(200).send({success:true, user:foundUser});
    })
    
  }catch(err){
    console.log(err);
    return res.status(500).send({success:false, errorHandled:false, message:"Unexped error occured"});
  }
})

router.get("/api/authenticate/check_user",async (req,res)=>{
  if(!req.session.userId) return res.send({user:null, success:false});
  const id=new Types.ObjectId(`${req.session.userId}`);
  const foundUser=await User.findById(id,{},{lean:true});
  return res.send({success:true,user:foundUser});
})

router.get('/api/logout',(req,res)=>{
  req.session.destroy(err=>{
    if(err) return res.status(500).send({success:false, errorHandled:true, message:"Failed to disconnect you"});
    res.clearCookie('connect.sid');
    return res.send({success:true, disconnected:true});
  })
})

export default router;