import { Router } from "express";
import {
  getImageController,
  viewTeachersOrStudentsController,
} from "./controllers";
import { authenticateUserWithJWT } from "../middleWare/portalMiddleware";

const router = Router();
router.get(
  "/findall",
  authenticateUserWithJWT("principal"),
  viewTeachersOrStudentsController
);
router.get("/get-image/:filename", getImageController);

export default router;
