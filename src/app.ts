import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import routes from "./routes/index";
import path from 'path';
import fs from 'fs';


dotenv.config();

const app: Express = express();
const port = process.env.PORT;
const dbUrl = process.env.DB_URL || "mongodb://127.0.0.1:27017/school";
app.use(cors());
app.use(express.static('uploads'));
app.use(express.json());



export const jwtSecret = process.env.SESSION_SECRET || "3y6T$#r9D@2sP!zW";

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "success",
    message: "Server is up and running",
    timestamp: new Date().toISOString()
  });
});

mongoose.connect(dbUrl).then(() => console.log("Connected!"));


app.use("/", routes);

const uploadsDir = path.join(__dirname, '..', 'src', 'uploads');
app.use('/uploads', express.static(uploadsDir));

fs.readdir(uploadsDir, (err, files) => {
  if (err) {
    console.error('Error reading uploads directory:', err);
  } else {
    console.log('Files in uploads directory:', files);
  }
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
