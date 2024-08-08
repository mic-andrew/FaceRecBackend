import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { recognizeFaceInImage } from './service';

const uploadDir = path.join(__dirname, '..', 'uploads');

// Ensure upload directory exists
fs.mkdir(uploadDir, { recursive: true }).catch(console.error);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log('Upload directory:', uploadDir);
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Error: Images Only!'));
    }
  }
}).single('image');

export async function recognizeFace(req: Request, res: Response) {
  upload(req, res, async function (err) {
    console.log('Upload function called');
    if (err instanceof multer.MulterError) {
      console.error('Multer error:', err);
      return res.status(500).json({ error: err.message });
    } else if (err) {
      console.error('Unknown error:', err);
      return res.status(500).json({ error: err.message });
    }

    try {
      console.log('Request file:', req.file);
      if (!req.file) {
        console.error('No file uploaded');
        return res.status(400).json({ error: 'No image file uploaded' });
      }

      console.log("File path:", req.file.path);

      // Check if file exists
      try {
        await fs.access(req.file.path);
        console.log('File exists');
      } catch (error) {
        console.error('File does not exist:', error);
        return res.status(500).json({ error: 'File not found after upload' });
      }

      const imageBuffer = await fs.readFile(req.file.path);
      console.log('Image buffer size:', imageBuffer.length);

      const result = await recognizeFaceInImage(imageBuffer);
      console.log('Recognition result:', result);
      
      // Optionally, remove the file after processing
      await fs.unlink(req.file.path).catch(console.error);

      res.json(result);
    } catch (error: any) {
      console.error('Error in recognizeFace:', error);
      res.status(500).json({ error: error.message });
    }
  });
}