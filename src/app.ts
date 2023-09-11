import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from 'body-parser'

import mongoose from "mongoose";
import routes from "./routes/index"


dotenv.config();

const app: Express = express();
const port = process.env.PORT;
const dbUrl = process.env.DB_URL || "mongodb://127.0.0.1:27017";
app.use(express.json());


mongoose.connect(dbUrl).then(() => console.log("Connected!"));


app.use("/", routes)

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
