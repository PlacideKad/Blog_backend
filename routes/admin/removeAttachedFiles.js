import Router from "express";
import { Types } from "mongoose";
import { Stash } from "../../model/stash.js";
import { Article } from "../../model/article.js";
import { deleteAttachedFile } from "../../middleware/deleteUselessData.js";

const router=Router();
//dans ce middleware on supprime le fichier indesire de cloudinary.
//de la ou envois la nouvelle liste de fichiers attaches sans le fichier supprime directement dans le body.
// si on provient de create article, il n'y aura pas besoin de supprimer quoi que ce soit de la base de donnee, 
// en ajoutant un parametre special, on pourra return res deja dans le middleware dans ce cas la.
//
//on n'a plus qu'a mettre a jour notre base de donnees.
// si l'appel est fait depuis edit stash from_stash doit etre true
//si l'appel est fait depuis edit article from_stash doit etre false
//on retourne le document stash pour mettre a jour notre interface
router.patch('/api/admin/delete/cloudinary/file/:id',deleteAttachedFile,async (req,res)=>{
    const id=new Types.ObjectId(`${req.params.id}`);
    const {from_stash}=req.body;
    const {related_files}=req;
    try{
        const update=from_stash? 
        await Stash.findByIdAndUpdate(id,{$set:{related_files:related_files}},{new:true}):
        await Article.findByIdAndUpdate(id,{$set:{related_files:related_files}},{new:true});

        if(!update) throw new Error(`Error while updating a ${from_stash?'stash':'article'} after removing one of its related files from cloudinary`)
        res.status(200).send(from_stash?{success:true, stash:update}:{sucess:true, article:update});
    }catch(err){
        console.log(err);
        res.status(500).send({sucess:false, message:err});
    }
})

export default router;