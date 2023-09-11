import express, { Request, Response } from "express";

const registerUser = (req: Request, res: Response) => {
  res.send("welcome to register endpoint");
};

const login = (req: Request, res: Response) => {};

export { registerUser, login };
