import { Router } from "express";
import jwt from 'jsonwebtoken';
import createUser from "../middleware/createUser.js";

const router=Router();
router.get('/api/profile',createUser,(req,res)=>{
  const user=req.user;
  const token=jwt.sign({id:user.id},process.env.JWT_SECRET,{expiresIn:'1h'});
  res.cookie('auth_token',token,{
    httpOnly:true,
    secure:false,//true en prod
    sameSite:'lax',
    maxAge:1000*60*60
  });
  res.redirect(process.env.FRONTEND_HOME);
});

router.get('/api/logout',(req,res)=>{
  req.logout(()=>{
    res.clearCookie('auth_token');
    res.send({disconnected:true});
  });
})
export default router