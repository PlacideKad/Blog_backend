import { Router } from "express";
const router=Router();
router.post('/api/removeCloudinary',(req,res)=>{
  console.log(`we delete picture ${req.body.publicId} from cloudinary`);
  res.status(201).send({success:true})
});

export default router;