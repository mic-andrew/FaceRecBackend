import { Router } from "express";
import { loginController, registerUser } from "../auth/controllers";
import { upload } from "../middleWare/uploadFileMiddleware";

const router = Router();

router.post("/register", upload.single("profileImage"), registerUser);
router.post("/login", loginController);

export default router;
