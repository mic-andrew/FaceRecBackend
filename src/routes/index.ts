import { Router } from "express";
import authRoutes from "../auth/routes"
import faceRecognitionRoutes from "../faceRecognition/routes"
import facialEmotionRoutes from "../emotionRecognition/routes"
import medCryptRoutes from "../medcrypt/routes"

const router = Router();

router.use("/auth", authRoutes);
router.use("/face-recognition", faceRecognitionRoutes);
router.use("/facial-emotion", facialEmotionRoutes);
router.use("/med-crypt", medCryptRoutes);



export default router;

