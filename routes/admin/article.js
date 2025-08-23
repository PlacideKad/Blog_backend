import Router from 'express';
import { Article } from '../../model/article.js';
import { Stash } from '../../model/stash.js';
import { Types } from 'mongoose';

const router=Router();

// Penser a ajouter un middleware de validation

router.post('/api/admin/article',async (req,res)=>{
  try{
    const {body}=req;
    if(body.stash_id){
      const id=new Types.ObjectId(`${body.stash_id}`);
      const deletedStash= await Stash.findByIdAndDelete(id);
      if(!deletedStash) throw new Error('Error while deleting the stashed work');
    }
    const newArticle=new Article({...body,stash_id:undefined});
    const savedArticle= await newArticle.save();
    if(!savedArticle) throw new Error('Error while creating a new article ') ;
    return res.status(201).send({success:true});
  }catch(err){
    console.log(err);
    return res.status(400).send({message:err})
  }
});
export default router