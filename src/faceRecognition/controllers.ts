import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { fetchSuspects, recognizeFaceInImage, uploadSuspectData } from './service';
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
}).fields([
  { name: 'image0', maxCount: 1 },
  { name: 'image1', maxCount: 1 },
  { name: 'image2', maxCount: 1 },
  { name: 'image3', maxCount: 1 },
  { name: 'image4', maxCount: 1 },
  { name: 'image5', maxCount: 1 },

]);

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
  console.info('Starting uploadSuspect function');
  
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      console.error(`Multer error: ${err.message}`, { stack: err.stack });
      return res.status(500).json({ error: err.message });
    } else if (err) {
      console.error(`Unknown error during file upload: ${err.message}`, { stack: err.stack });
      return res.status(500).json({ error: err.message });
    }

    console.info('File upload successful, processing request');

    try {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const imageFiles = Object.values(files).flat();

      if (!imageFiles || imageFiles.length === 0) {
        console.warn('No image files uploaded');
        return res.status(400).json({ error: 'No image files uploaded' });
      }

      console.info(`Number of files uploaded: ${imageFiles.length}`);

      const suspectData = {
        name: req.body.name,
        age: parseInt(req.body.age),
        lastLocation: req.body.lastLocation,
        country: req.body.country,
        gender: req.body.gender,
        images: imageFiles.map(file => file.filename)
      };

      console.info('Suspect data prepared', { suspectData: { ...suspectData, images: suspectData.images.length } });

      console.info('Attempting to upload suspect data to database');
      const result = await uploadSuspectData(suspectData);
      console.info('Suspect data successfully uploaded to database', { result });

      res.json(result);
    } catch (error: any) {
      console.error('Error in uploadSuspect function', {
        error: error.message,
        stack: error.stack,
        requestBody: req.body,
        files: req.files ? Object.keys(req.files).length : 'No files'
      });
      res.status(500).json({ error: error.message });
    }
  });
}
export async function getSuspects(req: Request, res: Response) {
  try {
    const suspects = await fetchSuspects();
    res.json(suspects);
  } catch (error: any) {
    console.error('Error fetching suspects:', error);
    res.status(500).json({ error: 'An error occurred while fetching suspects' });
  }
}

