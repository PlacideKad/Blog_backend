import express from 'express';
import session from 'express-session';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import authenticationRoute from './routes/auth.js';
import profileRoute from './routes/profile.js';
import redirectRoute from './routes/redirect.js';
import userRoute from './routes/user.js';

import { Strategy as GoogleStrategy } from 'passport-google-oauth2';
import { config } from "dotenv";
import cors from 'cors';

config();
const app=express();
app.use(express.json());
app.use(cookieParser());

const allowed_origins=['http://localhost:5173'];

app.use(cors({
  origin:(origin,callback)=>{
    if(!origin || allowed_origins.includes(origin)) callback(null,true)
    else callback(new Error('Origin not allowed by cors'));
  },
  credentials:true
}));

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
  callbackURL:process.env.CALLBACK_URL
},(accessToken,refreshToken,profile,done)=>{
  return done(null,profile);
}));

app.use(authenticationRoute);
app.use(profileRoute);
app.use(redirectRoute);
app.use(userRoute);
const PORT=process.env.PORT || 3000;
app.listen(PORT, ()=>console.log(`App is running on port ${PORT}`));