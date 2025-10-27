import Router from 'express';
import { Article } from '../../model/article.js';
import { Stash } from '../../model/stash.js';
import { Types } from 'mongoose';
import { deleteCloudinaryCover, deleteComments , deleteRelatedFiles} from '../../middleware/deleteUselessData.js';
const router=Router();

// Penser a ajouter un middleware de validation

router.post('/api/admin/article',async (req,res, next)=>{
  try{
    const {body}=req;
    if(body.stash_id){
      const id=new Types.ObjectId(`${body.stash_id}`);
      const updatedStash=await Stash.findByIdAndUpdate(id,{...body,stash_id:undefined},{runValidators:true,new:true});
      if(!updatedStash) throw new Error('Error while updating the stashed work');
      const deletedStash= await Stash.findByIdAndDelete(id);
      if(!deletedStash) throw new Error('Error while deleting the stashed work');
      req.coverLinkToDelete=deletedStash?.cover?.link;
      req.relatedFilesToDelete=deletedStash?.related_files;
      if(deletedStash.from_article){
        const updatedArticle=await Article.findByIdAndUpdate(deletedStash.from_article,{title:deletedStash.title,summary:deletedStash.summary,content:deletedStash.content,related_files:deletedStash.related_files,cover:deletedStash.cover},{runValidators:true});
        if(!updatedArticle) throw new Error('Error while updating an already existing article from stash');
        return next();
      }
    }
    const newArticle=new Article({...body,stash_id:undefined});
    const savedArticle= await newArticle.save();
    if(!savedArticle) throw new Error('Error while creating a new article ') ;
    
    body.stash_id?next():res.status(201).send({success:true});
  }catch(err){
    console.log(err);
    return res.status(400).send({auccess:false,message:err})
  }
},deleteRelatedFiles,deleteCloudinaryCover);

router.post('/api/admin/article/update',async (req,res , next)=>{
  const {body}=req;
  const id=new Types.ObjectId(`${body.article_id}`);
  try{
    const updatedArticle=await Article.findByIdAndUpdate(id,{...body,article_id:undefined},{runValidators:true});
    if(!updatedArticle) throw new Error('Error when updating an article');
    req.coverLinkToDelete=updatedArticle?.cover?.link;
    next();
  }catch(err){
    console.log(err);
    res.status(400).send({error:err});
  }
}, deleteCloudinaryCover);
router.get('/api/admin/articles/:id',async(req,res)=>{
  const id=new Types.ObjectId(`${req.params.id}`);
  try{
    const article=await Article.findById(id,{likes:0, read:0});
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
    req.coverLinkToDelete=deletedArticle?.cover?.link;
    req.relatedFilesToDelete=deletedArticle?.related_files;
    next();
  }catch(err){
    console.log(err);
    return res.status(500).send({error:err});
  }
},deleteRelatedFiles,deleteCloudinaryCover);

export default router