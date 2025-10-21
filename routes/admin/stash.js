import { Router } from "express";
import { Stash } from "../../model/stash.js";
import { Types } from "mongoose";
import { deleteCloudinaryCoversArray , deleteCloudinaryCover} from "../../middleware/deleteUselessData.js";

const router=Router();

router.post('/api/admin/stash',deleteCloudinaryCoversArray,async (req,res)=>{
  const {body}=req;
  try{
    if(body.stash_id){
      const id=new Types.ObjectId(`${body.stash_id}`);
      const updatedStash= await Stash.findByIdAndUpdate(id,{...body,stash_id:undefined},{runValidators:true});
      if(!updatedStash) throw new Error('Error when updating a stashed work');
      return res.status(200).send({success:true,stash_id:updatedStash._id});
    }else{
      const id=body.article_id?new Types.ObjectId(`${body.article_id}`):null;
      const newStash=body.article_id?new Stash({...body,article_id:undefined,from_article:id}):new Stash(body);
      const savedStash=await newStash.save();
      if(!savedStash) throw new Error('Error occured when creating a new stash');
      return res.status(201).send({success:true, stash_id:savedStash._id});
    }
  }catch(err){
    console.log(err);
    res.status(400).send({error:err,success:false});
  }
});

router.get('/api/admin/stashes',async (req,res)=>{
  const limit=parseInt(req.query.limit) || 6;
  const page=parseInt(req.query.page) || 1;
  const skip=(page-1)*limit;
  let {search, exact }=req.query;
  const sort_by=req.query.sort_by || 'createdAt';
  const order=parseInt(req.query.order) || 1;
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
      const foundStash=await Stash.findOne({title:regex});
      if(!foundStash) return res.send({succes:false,data:null});
      return res.send({success:true,foundData:[foundStash]})
    }
    const nb_documents=await Stash.countDocuments(regex?{title:regex}:{});
    const nb_pages=Math.ceil(nb_documents/limit);
    const stashes=regex?
    await Stash.find({title:regex}).sort({[sort_by]:order}):
    (sort_by==="createdAt"||sort_by==="title")?
    await Stash.find().limit(limit).skip(skip).sort({[sort_by]:order}):null;
    if (!stashes) throw new Error('Error occured when retrieving stashes from the database');
    return regex?res.send({foundData:stashes,success:true}):res.send({stashes,nb_pages,success:true});
  }catch(err){
    console.log(err);
    res.status(500).send({error:err});
  }
});

router.get('/api/admin/stashes/:id',async(req,res)=>{
  const id=new Types.ObjectId(`${req.params.id}`);
  try{
    const stash=await Stash.findById(id);
    if(!stash) throw new Error('Error occured when fetching the stash data');
    res.status(200).send({stash});
  }catch(err){
    console.log(err);
    res.status(400).send({error:err});
  }
});
router.delete('/api/admin/stashes',async (req,res,next)=>{
  const id=new Types.ObjectId(`${req.body.id}`);
  try{
    const deletedStash=await Stash.findByIdAndDelete(id);
    if(!deletedStash) throw new Error('Error when deleting a stashed work');
    req.coverLinkToDelete=deletedStash.cover.link;
    next();
  }catch(err){
    console.log(err);
    return res.status(500).send({error:err});
  }
}, deleteCloudinaryCover);

export default router