import { Router } from "express";
import { Article } from "../model/article.js";
import { Types } from "mongoose";
const router= Router();

//penser a la pagination. Chaque page ne poura conteninr que 9 articles.
//Penser a rajouter des filtres

router.get('/api/articles',async (req,res)=>{
  try{
    const articles=await Article.find();
    if (!articles) throw new Error('Error occured when retrieving articles from the database');
    return res.send(articles);
  }catch(err){
    console.log(err);
    res.status(500).send({error:err});
  }
});

router.get('/api/articles/:id',async (req,res)=>{  
  try{
    const id=new Types.ObjectId(`${req.params.id}`);
    const article=await Article.findById(id);
    if(!article) throw new Error('No article found with this id');
    return res.status(200).send({found:true,message:'Article found successfully',article})
  }catch(err){
    console.log(err);
    res.status(404).send({found:false,message:err})
  }
})
export default router;