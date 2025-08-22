import { Router } from "express";
import {Stash} from '../model/stash.js';
const router=Router();
router.get('/api/stashes',async (req,res)=>{
  try{
    const stashes=await Stash.find();
    if (!stashes) throw new Error('Error occured when retrieving stashes from the database');
    return res.send(stashes);
  }catch(err){
    console.log(err);
    res.status(500).send({error:err});
  }

})
export default router;