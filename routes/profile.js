import { Router } from "express";
import jwt from 'jsonwebtoken';

const router=Router();
router.get('/api/profile',(req,res)=>{
  if(!req.isAuthenticated()) return res.redirect('/api/redirect');
  const user=req.user;
  const token=jwt.sign({id:user.id,name:user.name,email:user.email,picture:user.picture},process.env.JWT_SECRET,{expiresIn:'1h'});
  res.cookie('auth_token',token,{
    httpOnly:true,
    secure:false,//true en prod
    sameSite:'lax',
    maxAge:1000*60*60
  });
  res.redirect('http://localhost:5173');
});

router.get('/api/logout',(req,res)=>{
  req.logout(()=>{
    res.clearCookie('auth_token');
    res.send({disconnected:true});
  });
})
export default router