import { Router } from "express";

const router=Router();
//old route api/profile
router.get('/api/logout',(req,res)=>{
  // update if necessary
  req.logout(()=>{
    res.clearCookie('auth_token');
    res.send({disconnected:true});
  });
})
export default router