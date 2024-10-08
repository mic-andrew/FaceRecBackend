import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import routes from "./routes/index";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;
const dbUrl = process.env.DB_URL || "mongodb://127.0.0.1:27017/school";
app.use(cors());
app.use(express.static('uploads'));
app.use(express.json());



export const jwtSecret = process.env.SESSION_SECRET || "3y6T$#r9D@2sP!zW";

mongoose.connect(dbUrl).then(() => console.log("Connected!"));

app.use("/", routes);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
