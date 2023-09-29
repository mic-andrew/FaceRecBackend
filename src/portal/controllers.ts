import { Request, Response } from "express";
import { viewTeachersOrStudentsService } from "./service";
const path = require("path");
const fs = require("fs");

export const viewTeachersOrStudentsController = async (
  req: Request,
  res: Response
) => {
  const { role }: any = req.query;
    const token = req.headers.authorization
  const response = await viewTeachersOrStudentsService(role);
  res.status(200).json({ data: response, success: true });
};

export const getImageController = (req: Request, res: Response) => {
  const { filename } = req.params;
  const imagePath = path.join(process.env.IMAGE_UPLOAD_DIRECTORY, filename);
  if (fs.existsSync(imagePath)) {
    res.sendFile(imagePath);
  } else {
    res.status(404).json({ error: "Image not found" });
  }
};
