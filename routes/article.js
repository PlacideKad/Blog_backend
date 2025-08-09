import { Router } from "express";
import { Article } from "../model/article.js";

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
export default router;