import { Request, Response } from "express";
import { viewTeachersOrStudentsService } from "./service";

export const viewTeachersOrStudentsController = async (
  req: Request,
  res: Response
) => {
  const { role }: any = req.query;
  const response = await viewTeachersOrStudentsService(role);
  res.status(200).json({ data: response, success: true });
};
