import { Router } from "express";
import { Stash } from "../../model/stash.js";
import { Types } from "mongoose";
import { deleteCloudinaryCoversArray ,deleteRelatedFiles, deleteCloudinaryCover} from "../../middleware/deleteUselessData.js";
import uniqueString from "unique-string";
import { v2 as cloudinary} from "cloudinary";
import checkUserIsAdmin from "../../middleware/checkUserIsAdmin.js";

const router=Router();

const getCloudinaryLinkFromPublicId=(public_id)=>{
  return `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/${public_id}`;
}

const copyCloudinaryItem=async (public_id)=>{
  try{
    const res=await cloudinary.uploader.upload(getCloudinaryLinkFromPublicId(public_id),
    {public_id: `${public_id}_copy_${uniqueString()}`});
    const newPublicId=res.public_id;
    return newPublicId;
  }catch(err){
    console.log(err);
    return null;
  }
}

router.post('/api/admin/stash',
  checkUserIsAdmin,
  deleteCloudinaryCoversArray,
  async (req,res)=>{
    const {body}=req;
    try{
      if(body.stash_id){
        const id=new Types.ObjectId(`${body.stash_id}`);
        const updatedStash= await Stash.findByIdAndUpdate(id,{...body,stash_id:undefined},{runValidators:true});
        if(!updatedStash) throw new Error('Error when updating a stashed work');
        return res.status(200).send({success:true,stash_id:updatedStash._id});
      }else{
        const id=body.article_id?new Types.ObjectId(`${body.article_id}`):null;
        //this is where we need to create a copy of ALL the related files and cover using random string at the end of the new display_name
        //As the body already contains the related files and the cover, the data that'll be used to create the new Stash will take the copied values
        let newRelatedFiles=[];
        let newCoverLink=null;
        if(id){
          if(body.related_files && body.related_files.length>0){
            for(const file of body.related_files){
              const newDisplayName=await copyCloudinaryItem(file.display_name);
              if(newDisplayName) newRelatedFiles.push({...file,display_name:newDisplayName,file:{link:getCloudinaryLinkFromPublicId(newDisplayName)}});
            }
          }
          if(body.cover && body.cover.link && body.cover.link!==process.env.DEFAULT_STASH_LINK & body.cover.link!==process.env.DEFAULT_PUBLISHED_LINK){
            const publicId=body.cover.link.split('/').pop();
            const newCoverPublicId=await copyCloudinaryItem(publicId);
            newCoverLink=newCoverPublicId?getCloudinaryLinkFromPublicId(newCoverPublicId):null;
          }
        }
        const newStash=body.article_id?new Stash({...body,article_id:undefined,from_article:id, relatedFiles:newRelatedFiles,cover:{link:newCoverLink}}):new Stash(body);
        const savedStash=await newStash.save();
        if(!savedStash) throw new Error('Error occured when creating a new stash');
        return res.status(201).send({success:true, stash_id:savedStash._id});
      }
    }catch(err){
      console.log(err);
      res.status(400).send({error:err,success:false});
    }
  }
);

router.post('/api/admin/stashes',async (req,res)=>{
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
    req.coverLinkToDelete=deletedStash?.cover?.link;
    req.relatedFilesToDelete=deletedStash?.related_files;
    next();
  }catch(err){
    console.log(err);
    return res.status(500).send({error:err});
  }
}, deleteRelatedFiles,deleteCloudinaryCover);

export default router