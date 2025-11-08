import { Router } from "express";

const router=Router();

router.get('/api/redirect',(req,res)=>{
  res.redirect(process.env.FRONTEND_HOME_DEV);
});

export default router;