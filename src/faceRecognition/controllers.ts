import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { recognizeFaceInImage, uploadSuspectData } from './service';
import SuspectImage from '../models/SuspectImage';

const uploadDir = path.join(__dirname, '..', 'uploads');

// Ensure upload directory exists
fs.mkdir(uploadDir, { recursive: true }).catch(console.error);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
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
}).array('images', 10);

export async function recognizeFace(req: Request, res: Response) {
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json({ error: err.message });
    } else if (err) {
      return res.status(500).json({ error: err.message });
    }

    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No image file uploaded' });
      }

      const imageBuffer = await fs.readFile(req.file.path);
      const result = await recognizeFaceInImage(imageBuffer);
      
      if (result.name !== 'unknown') {
        // Save the image details to the database
        const newImage = new SuspectImage({
          filename: req.file.filename,
          name: result.name,
          distance: result.distance
        });
        await newImage.save();
      }

      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
}


export async function uploadSuspect(req: Request, res: Response) {
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json({ error: err.message });
    } else if (err) {
      return res.status(500).json({ error: err.message });
    }

    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'No image files uploaded' });
      }

      const suspectData = {
        name: req.body.name,
        age: parseInt(req.body.age),
        lastLocation: req.body.lastLocation,
        country: req.body.country,
        gender: req.body.gender,
        images: (req.files as Express.Multer.File[]).map(file => file.filename)
      };

      const result = await uploadSuspectData(suspectData);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
}

export const fetchSuspectsController = (()=>{
  
})