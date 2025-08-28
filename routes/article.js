import { Router } from "express";
import { Article } from "../model/article.js";
import { Types } from "mongoose";
import { Comment } from "../model/comment.js";
import { User } from '../model/user.js';

const router= Router();

router.get('/api/articles',async (req,res)=>{
  const limit=parseInt(req.query.limit) || 6;
  const page=parseInt(req.query.page) || 1;
  const skip=(page-1)*limit;
  let {search, exact }=req.query;

  let regex=null;
  if(search){
    exact=parseInt(exact);
    if(exact===0){
      search=search.split(' ');
      regex=new RegExp(`\\b(${search.join("|")})\\b`,"i");
    }else regex=new RegExp(`^${search}$`,"i");
  } 

  try{
    if(exact===1){
      const foundArticle=await Article.findOne({title:regex});
      if(!foundArticle) return res.send({succes:false,data:null});
      return res.send({success:true,data:[foundArticle]})
    }
    const nb_articles=await Article.countDocuments(regex?{title:regex}:{});
    const nb_pages=Math.ceil(nb_articles/limit);
    const articles=regex?await Article.find({title:regex}):await Article.find().limit(limit).skip(skip);
    if (!articles) throw new Error('Error occured when retrieving articles from the database');
    return regex?res.send({data:articles}):res.send({articles,nb_pages});
  }catch(err){
    console.log(err);
    res.status(500).send({error:err});
  }
  res.sendStatus(200);
});

router.get('/api/articles/titles',async(req,res)=>{
  try{
    const titles=await Article.find({},{_id:1,title:1},{lean:true}).sort({createdAt:-1}).limit(3);
    res.status(200).send({titles});
  }catch(err){
    console.log(err);
    res.sendStatus(500);
  }
});

router.post('/api/articles/:id',async (req,res)=>{  
  try{
    const id=new Types.ObjectId(`${req.params.id}`);
    let article=await Article.findById(id);
    if(req.body && Object.keys(req.body).length!==0){
      const user_id=new Types.ObjectId(`${req.body.user_id}`);
      let read=article.read || [];
      if(!read.some(id=>id.equals(user_id))){
        article=await Article.findByIdAndUpdate(id,{$push:{read:user_id}},{runValidators:true,new:true})
      }
    }
    if(!article) throw new Error('No article found with this id');
    const comments_=await Comment.find({$and:[
      {parent:id},
      {parentModel:'article'}
    ]},{content:1,author:1,createdAt:1,updatedAt:1},{lean:true});
    let comments=[];
    await(async()=>{
      for(let comment of comments_){
        const author_infos=await User.findById(comment.author,{picture:1,_id:0,given_name:1,family_name:1});
        comments.push({...comment,author_infos});
      }
    })();
    return res.status(200).send({found:true,message:'Article found successfully',article,comments})
  }catch(err){
    console.log(err);
    res.status(404).send({found:false,message:err})
  }
});

router.post('/api/articles/:id/like',async (req,res)=>{
  try{
    const user_id=new Types.ObjectId(`${req.body.id}`);
    const article_id=new Types.ObjectId(`${req.params.id}`);
    const {likes}=await Article.findById(article_id,{likes:1,_id:0},{lean:true});
    let updatedArticle=null;
    if(likes.some(id=>id.equals(user_id))){
      updatedArticle=await Article.findByIdAndUpdate(article_id,{$pull:{likes:user_id}},{runValidators:true,new:true});
      if(!updatedArticle) throw new Error('Error occured when liking an article ');
      res.status(200).send({userLiked:false,likes:updatedArticle.likes});
    }else{
      updatedArticle=await Article.findByIdAndUpdate(article_id,{$push:{likes:user_id}},{runValidators:true,new:true});
      if(!updatedArticle) throw new Error('Error occured when liking an article ');
      res.status(201).send({userLiked:true,likes:updatedArticle.likes});
    }
  }catch(err){
    console.log(err);
    res.sendStatus(400);
  }
});
export default router;