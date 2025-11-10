import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import authenticationRoute from './routes/auth.js';
import userRoute from './routes/user.js';
import adminArticleRoute from './routes/admin/article.js';
import articleRoute from './routes/article.js';
import commentRoute from './routes/comment.js';
import adminStashRoute from './routes/admin/stash.js';
import adminUserRoute from './routes/admin/user.js';
import removeCloudinaryRoute from './routes/cloudinaryRequests.js';
import removeFiles from './routes/admin/removeAttachedFiles.js';
import {v2 as cloudinary} from 'cloudinary';
import mongoose from 'mongoose';
import { config } from "dotenv";
import cors from 'cors';
import MongoStore from 'connect-mongo';

config();
const app=express();
app.use(express.json());
app.use(cookieParser());

const allowed_origins=[process.env.FRONTEND_HOME_DEV,process.env.FRONTEND_HOME_PROD];

app.use(cors({
  origin:(origin,callback)=>{
    if(!origin || allowed_origins.includes(origin)) callback(null,true)
    else callback(new Error('Origin not allowed by cors'));
  },
  credentials:true
}));

mongoose.connect(process.env.MONGODB_URL_DEV)
.then(()=>console.log('Sucessfully connected to the database'))
.catch(err=>{
  console.log('An error occured when connecting to the database',err)
});

app.use(session({
  secret:process.env.SESSION_SECRET,
  saveUninitialized:true,
  resave:false,
  store:MongoStore.create({
    mongoUrl:process.env.MONGODB_URL_DEV,
    collectionName:'sessions'
  }),
  cookie:{
    maxAge:1000*60*60,
    httpOnly:true,
    secure:false,//true en prod
    sameSite:'lax'
  }
}));

// Cloudinary config

cloudinary.config({
  cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
  api_key:process.env.CLOUDINARY_API_KEY,
  api_secret:process.env.CLOUDINARY_API_SECRET
});

app.use(authenticationRoute);
app.use(userRoute);
app.use(adminArticleRoute);
app.use(articleRoute);
app.use(commentRoute);
app.use(adminStashRoute);
app.use(adminUserRoute);
app.use(removeCloudinaryRoute);
app.use(removeFiles);

const PORT=process.env.PORT || 3000;
app.listen(PORT, ()=>console.log(`App is running on port ${PORT}`));