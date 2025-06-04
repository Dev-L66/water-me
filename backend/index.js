import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectToDb } from "./config/db/db.config.js";
import authRoutes from "./routes/auth.routes.js";
import plantRoutes from "./routes/plant.routes.js";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});


const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors({
    origin: "http://localhost:3000",
    allowedHeaders: ["Content-Type", "Cookie", "Authorization"],
    methods:["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
app.use(express.json({limit: "5mb"}));
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/plant', plantRoutes);

app.listen(PORT, async () => {
  try {
    console.log(`Server is listening to port ${PORT}`);
    await connectToDb();
  } catch (error) {
    console.log(error);
  }
});
