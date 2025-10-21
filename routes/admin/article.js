import Router from 'express';
import { Article } from '../../model/article.js';
import { Stash } from '../../model/stash.js';
import { Types } from 'mongoose';
import { deleteCloudinaryCover, deleteComments } from '../../middleware/deleteUselessData.js';
const router=Router();

// Penser a ajouter un middleware de validation

router.post('/api/admin/article',async (req,res)=>{
  try{
    const {body}=req;
    if(body.stash_id){
      const id=new Types.ObjectId(`${body.stash_id}`);
      const updatedStash=await Stash.findByIdAndUpdate(id,{...body,stash_id:undefined},{runValidators:true});
      if(!updatedStash) throw new Error('Error while updating the stashed work');
      const deletedStash= await Stash.findByIdAndDelete(id);
      if(!deletedStash) throw new Error('Error while deleting the stashed work');
      if(deletedStash.from_article){
        const updatedArticle=await Article.findByIdAndUpdate(deletedStash.from_article,{title:deletedStash.title,summary:deletedStash.summary,content:deletedStash.content},{runValidators:true});
        if(!updatedArticle) throw new Error('Error while updating an already existing article from stash');
        return res.status(200).send({success:true});
      }
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

router.post('/api/admin/article/update',async (req,res)=>{
  const {body}=req;
  const id=new Types.ObjectId(`${body.article_id}`);
  try{
    const updatedArticle=await Article.findByIdAndUpdate(id,{...body,article_id:undefined},{runValidators:true});
    if(!updatedArticle) throw new Error('Error when updating an article');
    return res.status(200).send({success:true});
  }catch(err){
    console.log(err);
    res.status(400).send({error:err});
  }
});
router.get('/api/admin/articles/:id',async(req,res)=>{
  const id=new Types.ObjectId(`${req.params.id}`);
  try{
    const article=await Article.findById(id,{content:1,title:1,summary:1,_id:1});
    if(!article) throw new Error('Error occured when fetching the article data');
    res.status(200).send({article});
  }catch(err){
    console.log(err);
    res.status(400).send({error:err});
  }
});
router.delete('/api/admin/articles',deleteComments,async (req,res,next)=>{
  const id=new Types.ObjectId(`${req.body.id}`);
  try{
    const deletedArticle=await Article.findByIdAndDelete(id);
    if(!deletedArticle) throw new Error('Error when deleting a published article');
    req.coverLinkToDelete=deletedArticle.cover.link;
    next();
  }catch(err){
    console.log(err);
    return res.status(500).send({error:err});
  }
},deleteCloudinaryCover);

export default router