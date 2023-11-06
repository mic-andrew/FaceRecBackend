import { Request, Response } from "express";
import {
  saveEventToDb,
  viewTeachersOrStudentsService,
  getAllEventsService,
} from "./service";
import { EventTypes } from "../types/types";
const path = require("path");
const fs = require("fs");

export const viewTeachersOrStudentsController = async (
  req: Request,
  res: Response
) => {
  const { role }: any = req.query;
  const token = req.headers.authorization;
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

export const addEventController = async (req: Request, res: Response) => {
  const event: EventTypes = req.body;
  console.log("req.file", req.file);
  if (req.file) {
    event.image = req.file.filename;
    console.log(req.file.filename);
  }
  console.log("event", event);

  try {
    const response: any = await saveEventToDb(event);
    if (response?.title) {
      res.status(200).json({
        data: response,
        success: true,
      });
    }
  } catch (e) {
    return e;
  }
};

export const getEventsController = async (req: Request, res: Response) => {
  try {
    const response: any = await getAllEventsService();
    console.log(response)
    if (response.data) {
      res.status(200).json({
        data: response.data,
        success: true,
      });
    }
  } catch (e) {
    return e;
  }
};
