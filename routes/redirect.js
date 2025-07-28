import { Router } from "express";

const router=Router();

router.get('/api/redirect',(req,res)=>{
  res.redirect('http://localhost:5173');
})

export default router;