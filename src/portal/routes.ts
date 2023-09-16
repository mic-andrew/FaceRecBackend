import { Router } from "express";
import { viewTeachersOrStudentsController } from "./controllers"

const router = Router();
router.get("/findall", viewTeachersOrStudentsController)


export default router;