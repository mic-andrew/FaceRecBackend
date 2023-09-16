import { Router } from "express";
import { getImageController, viewTeachersOrStudentsController } from "./controllers";

const router = Router();
router.get("/findall", viewTeachersOrStudentsController);
router.get('/get-image/:filename', getImageController);


export default router;
