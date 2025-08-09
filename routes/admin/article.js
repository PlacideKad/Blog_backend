import Router from 'express';
import { Article } from '../../model/article.js';

const router=Router();

// Penser a ajouter un middleware de validation

router.post('/api/admin/article',async (req,res)=>{
  try{
    const {body}=req;
    const newArticle=new Article(body);
    const savedArticle= await newArticle.save();
    if(!savedArticle) throw new Error('error while creating a new article ') ;
    return res.status(201).send(savedArticle);
  }catch(err){
    console.log(err);
    return res.status(400).send({message:err})
  }
  res.send({message:'connected',data:body});
});
export default router