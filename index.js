import express from 'express';
import session from 'express-session';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import authenticationRoute from './routes/auth.js';
import profileRoute from './routes/profile.js';
import redirectRoute from './routes/redirect.js';
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
import { Strategy as GoogleStrategy } from 'passport-google-oauth2';
import { config } from "dotenv";
import cors from 'cors';

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
  resave:false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user,done)=>{
  done(null,user);
});
passport.deserializeUser((user,done)=>{
  done(null,user);
});

passport.use(new GoogleStrategy({
  clientID:process.env.GOOGLE_CLIENT_ID,
  clientSecret:process.env.GOOGLE_CLIENT_SECRET,
  callbackURL:process.env.CALLBACK_URL_DEV
},(accessToken,refreshToken,profile,done)=>{
  return done(null,profile);
}));

// Cloudinary config

cloudinary.config({
  cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
  api_key:process.env.CLOUDINARY_API_KEY,
  api_secret:process.env.CLOUDINARY_API_SECRET
});

app.use(authenticationRoute);
app.use(profileRoute);
app.use(redirectRoute);
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