import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";


import connect from "./db/config.js";
import errorHandler from "./Errors/errorHandler.js";
import createError from "./Errors/createError.js";


const app=express();

//midleware
app.use(cors());
app.use(bodyParser.json({limit:"30mb",extended:true}));
app.use(bodyParser.urlencoded({limit:"30mb",extended:true}))
app.use(cors());
app.use(express.static('public')) ///serve public images
app.use("/images",express.static('images'))
app.use(errorHandler);
app.use(createError)

dotenv.config();
const PORT=process.env.PORT || 8080;
 const start= async()=>{
    
     try {
      await connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
      console.log('connected to db');
       
     } catch (error) {
        console.error(`${error} did not connect`);
     }
     app.listen(PORT,()=>{
        console.log(`listening at ${PORT}...`)
    })
 }
 start();