import express from 'express';
import { config } from "dotenv";
import cors from 'cors';

config();
const app=express();

const allowed_origins=['http://localhost:5173'];

app.use(cors({
  origin:(origin,callback)=>{
    if(!origin || allowed_origins.includes(origin)) return callback(null,origin);
    return callback(new Error('Origin not allowed by cors'));
  }
}));

app.use(express.json());

const PORT=process.env.PORT || 3000;
app.listen(PORT, ()=>console.log(`App is running on port ${PORT}`));