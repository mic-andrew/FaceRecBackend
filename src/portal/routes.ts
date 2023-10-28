import { Router } from "express";
import {
  addEventController,
  getImageController,
  viewTeachersOrStudentsController,
} from "./controllers";
import { authenticateUserWithJWT } from "../middleWare/portalMiddleware";
import { upload } from "../middleWare/uploadFileMiddleware";

const router = Router();
router.get(
  "/findall",
  authenticateUserWithJWT("principal"),
  viewTeachersOrStudentsController
);
router.get("/get-image/:filename", getImageController);
router.post("/add-event",upload.single('image'), addEventController);


export default router;
