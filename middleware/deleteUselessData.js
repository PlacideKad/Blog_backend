import {Comment} from '../model/comment.js';
import { Types } from 'mongoose';
import {v2 as cloudinary} from 'cloudinary';

export const deleteComments=async (req,res,next)=>{
  const article_id=new Types.ObjectId(`${req.body.id}`);
  try{
    const result=await Comment.deleteMany({parent:article_id,parentModel:'article'});
    if(!result.acknowledged) throw new Error('Error while deleting the comments linked to an article');
    next();
  }catch(err){
    console.log(err);
    return res.send({error:err});
  }
}
export const deleteCloudinaryCover=async(req,res)=>{
  const {coverLinkToDelete}=req;
  const publicId=coverLinkToDelete.split('/').pop();
  try{
    await cloudinary.uploader.destroy(publicId,(error,result)=>{
      if(error) throw new Error('Error deleting item from cloudinary');
      res.status(200).send({success:true});
    });
  }catch(err){
    console.log(err);
    res.status(500).send({error:err});
  }
}
export const deleteCloudinaryCoversArray=async(req,res,next)=>{
  const {coversArray}=req.body;
  if(coversArray && coversArray.length>1){
    try{
      for(let i=0;i<coversArray.length-1;i++){
        await cloudinary.uploader.destroy(coversArray[i],(error,result)=>{
          if(error) throw new Error('Error deleting item from cloudinary');
        });
      }
      next();
    }catch(err){
      console.log(err);
      res.status(500).send({success:false,message:err});;
    }
  }else next();
}

export const deleteAttachedFile=async (req,res,next)=>{
  // This middleware deletes one attached file when the user clicks on the x
  const {display_name_to_delete , from_edit}=req.body;
  let {related_files}=req.body;
  const resource_type_for_file_to_delete=related_files.find(file=>file.display_name===display_name_to_delete)?.resource_type;
  related_files=related_files.filter(file=>file.display_name!== display_name_to_delete);
  try{
    await cloudinary.uploader.destroy(display_name_to_delete,{resource_type:resource_type_for_file_to_delete},(error,result)=>{
      if(error) throw new Error('Error deleting item from cloudinary:',error);
      if(from_edit){
        req.related_files=related_files;
        next();
      }else res.status(200).send({success:true,data:{related_files}});//that data will be usefull for the create article page. resJson.data.related_files
    });

  }catch(err){
    console.log(err);
    return res.status(500).send({success:false, message:err});
  }
}
export const deleteRelatedFiles=async(req,res,next)=>{
  // this middleware deletes all the related files of an article/stash when it is deleted
  const {relatedFilesToDelete}=req;
  try{
    if(relatedFilesToDelete.length>0){
      for(let file of relatedFilesToDelete){
        await cloudinary.uploader.destroy(file?.display_name,(err,result)=>{
          if(err) throw new Error('Error occured when deleting a file from Cloudinary:',err);
        })
      }
    }
    next();
  }catch(err){
    console.log(err);
    res.status(500).send({success:false, message:err});
  }
}