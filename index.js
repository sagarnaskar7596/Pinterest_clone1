import express from 'express'
import dotenv from "dotenv"
import connectDb from './Database/db.js';
import cookieParser from 'cookie-parser';
import cloudinary from 'cloudinary';

dotenv.config();

cloudinary.v2.config({
    cloud_name : process.env.Cloud_Name,
    api_key: process.env.Cloud_Api,
    api_secret : process.env.Cloud_Secret,
});

const app = express()

const port= process.env.PORT

//using middleware thunder client

app.use(express.json());
app.use(cookieParser());

// app.get("/",(req,res)=>{
//     res.send("Heyyy ")
// })

//using routes
import userRoutes from './Routes/userRoutes.js';
import pinRoutes from './Routes/pinRoutes.js';
app.use("/api/user", userRoutes);
app.use("/api/pin",pinRoutes);

app.listen(port,()=>{
    console.log(`Server is runnin on http://localhost:${port}`);
    connectDb();
}) 
