import { User } from "../model/user.js";

const createUser=async (req,res,next)=>{
  try{
    if(!req.isAuthenticated()) return res.redirect('/api/redirect');
    const user=req.user;
    const existingUser=await User.findOne({id:user.id},{name:1,},{lean:true});
    if(!existingUser){
      const newUser=new User({id:user.id,email:user.email,given_name:user.given_name,family_name:user.family_name,picture:user.picture});
      await newUser.save();
    }
    next();
  }catch(err){
    console.log(err);
    res.sendStatus(400);
  }
}
export default createUser;