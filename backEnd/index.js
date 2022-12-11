import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
const app=express();

import connect from "./db/config.js";
import errorHandler from "./Errors/errorHandler.js";
import AuthRoute from "./routes/AuthRoutes.js";
import UserRouter from './routes/UserRoutes.js';
import ChatRoute from './routes/ChartRoutes.js';
import MessageRoute from "./routes/MessageRoutes.js"

dotenv.config();

// midleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json({limit:"30mb",extended:true}));
app.use(bodyParser.urlencoded({limit:"30mb",extended:true}))

app.use(express.static('public')); 
app.use('/images', express.static('images'));

app.use(errorHandler);
app.use('/auth',AuthRoute);
app.use('/user',UserRouter);
app.use('/chat', ChatRoute)
app.use('/message',MessageRoute);

app.get('/test',(req,res)=>{
    res.send("i am started sdhuioh");
})

const port=process.env.PORT || 3001
 const start= async ()=>{
    
     try {
        await connect(process.env.MONGO_URL);
      console.log('connected to db');
   
     } catch (error) {
        console.error(`${error} did not connect`);
        
     }
    
     app.listen(port,()=>{
        console.log(`server starting at ${port}`);
     })
 }

start();
