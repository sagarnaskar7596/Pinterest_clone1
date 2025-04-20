import express from "express";
import dotenv from "dotenv";
import connectDb from "./Database/db.js";
import cookieParser from "cookie-parser";
import cloudinary from "cloudinary";
import path from "path";

dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.Cloud_Name,
  api_key: process.env.Cloud_Api,
  api_secret: process.env.Cloud_Secret,
});

const app = express();

const port = process.env.PORT;

//using middleware thunder client

app.use(express.json());
app.use(cookieParser());

// app.get("/",(req,res)=>{
//     res.send("Heyyy ")
// })

//using routes
import userRoutes from "./Routes/userRoutes.js";
import pinRoutes from "./Routes/pinRoutes.js";
app.use("/api/user", userRoutes);
app.use("/api/pin", pinRoutes);

const __dirname = path.resolve();

app.use(express.static(path.join(__dirname, "../Frontend/dist")));  // Go up one level from Backend

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../Frontend/dist/index.html")); // Correct path
});

app.listen(port, () => {
  console.log(`Server is runnin on http://localhost:${port}`);
  connectDb();
});
