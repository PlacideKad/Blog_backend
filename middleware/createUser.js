import { User } from "../model/user.js";

const createUser=async (req,res,next)=>{
  try{
    if(!req.isAuthenticated()) return res.redirect('/api/redirect');
    const user=req.user;
    const existingUser=await User.findOne({id:user.id},{name:1,},{lean:true});
    if(!existingUser){
      const adminsList=[process.env.ADMIN_1_EMAIL,process.env.ADMIN_2_EMAIL];
      const newUser=new User({id:user.id,isAdmin:(adminsList.includes(user.email)),email:user.email,given_name:user.given_name,family_name:user.family_name,picture:'https://res.cloudinary.com/dmipesfyo/image/upload/c_fill,h_550,w_550/default_user_profile_picture'});
      await newUser.save();
    }
    next();
  }catch(err){
    console.log(err);
    res.sendStatus(400);
  }
}
export default createUser;