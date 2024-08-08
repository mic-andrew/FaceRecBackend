import { Router } from "express";
import authRoutes from "../auth/routes"
import faceRecognitionRoutes from "../faceRecognition/routes"

const router = Router();

router.use("/auth", authRoutes);
router.use("/face-recognition", faceRecognitionRoutes);



export default router;

