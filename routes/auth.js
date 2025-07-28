import { Router } from "express";
import passport from "passport";

const router=Router();

router.get('/api/auth/google',passport.authenticate('google',{scope:['profile','email']}));
router.get('/api/auth/google/callback',passport.authenticate('google',{failureRedirect:'/api/redirect'}),(req,res)=>{
  res.redirect('/api/profile');
});
export default router;