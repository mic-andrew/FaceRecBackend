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
const uploadsDir  = process.env.UPLOADS_DIR || 'uploads';

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "success",
    message: "Server is up and running",
    timestamp: new Date().toISOString()
  });
});

mongoose.connect(dbUrl).then(() => console.log("Connected!"));


app.use("/", routes);

console.log('=====>Current working directory:', process.cwd());

const files = fs.readdirSync(process.cwd());
console.log('Files and folders in current working directory:', files);

const srcDir = path.join(process.cwd(), 'src');
const srcFiles = fs.readdirSync(srcDir);
console.log('Files and folders in "src" directory:', srcFiles);


if (!uploadsDir) {
  console.error('UPLOADS_DIR is not set in environment variables');

}

if (!fs.existsSync(uploadsDir)) {
  console.log(`Creating upload directory: ${uploadsDir}`);
  try {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('Upload directory created successfully');
  } catch (err) {
    console.error(`Failed to create upload directory: ${err}`);
    process.exit(1);
  }
}

console.log('Using uploads directory:', uploadsDir);

// Serve static files from the uploads directory
app.use('/uploads', express.static(uploadsDir));

// Log the contents of the uploads directory
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
