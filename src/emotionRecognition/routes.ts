import express from 'express';
import multer from 'multer';
import path from 'path';
import { recognizeEmotionController, getEmotionHistoryController } from './controllers';

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.env.UPLOADS_DIR || path.join(__dirname, '..', 'uploads'))
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({ storage: storage });

router.post('/recognize', upload.single('image'), recognizeEmotionController);
router.get('/history', getEmotionHistoryController);

export default router;