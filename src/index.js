// require('dotenv').config({path: './env'})
import dotenv from "dotenv"
// import { app } from "./app.js"
import {app} from "./app.js"
// import mongoose from "mongoose";
// import { DB_NAME } from "./constants";
import connectDB from "./db/index.js"
dotenv.config({
    path: './env'
})
// always try to handle database connectio using try and catch and use await and async beacuase is takes time

/*import express from "express";
const app = express();
(async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        app.on("error",()=>{
            console.log("ERRR",error)
            throw error
        })
        app.listen(process.env.PORT,()=>{
            console.log(`App is listening on port ${process.env.PORT}`)
        })
    }
    catch (error) {
        console.error("Error: ", error)
        throw err
    }
})()
// here connection is established in the index file it makes the index.js file complex to do it professionalyy we create database connection file in db and then import here
*/
connectDB() 
.then(()=>{
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(` Server is running at port : ${process.env.PORT}`);
    })
})
.catch((err)=>{
    console.log("MONGODB  db connection failed !!!" , err);
})