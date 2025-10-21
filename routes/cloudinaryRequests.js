import { Router } from "express";
import {v2 as cloudinary} from 'cloudinary';
const router=Router();

router.post('/api/remove_cloudinary',(req,res)=>{
  const publicId=req.body.publicId;
  try{
    cloudinary.uploader.destroy(publicId,(error,result)=>{
      if(error) throw new Error('Error deleting item from cloudinary');
      return res.status(200).send({success:true,message:'Item deleted successfully from cloudinary',result});
    });

  }catch(err){
    console.log(err);
    return res.status(500).send({success:false,message:'Error deleting item from cloudinary'});
  }
});

export default router;