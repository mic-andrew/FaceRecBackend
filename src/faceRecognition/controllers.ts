import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { fetchSuspects, recognizeFaceInImage, uploadSuspectData } from './service';
import SuspectImage from '../models/SuspectImage';
import { uploadSingleImage, uploadSuspectImage } from '../middleWare/uploadFileMiddleware';
import Suspect from '../models/Suspects';



const uploadDir  = process.env.UPLOADS_DIR  || path.join(__dirname, '..', 'uploads');


// Ensure upload directory exists
fs.mkdir(uploadDir, { recursive: true }).catch(console.error);

function generateUniqueFilename(originalname: string): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  const extension = path.extname(originalname);
  return `suspect-${timestamp}-${random}${extension}`;
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, generateUniqueFilename(file.originalname));
  }
});

const fileFilter = function (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) {
  const filetypes = /jpeg|jpg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Error: Images Only!'));
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter
}).fields([
  { name: 'image0', maxCount: 1 },
  { name: 'image1', maxCount: 1 },
  { name: 'image2', maxCount: 1 },
  { name: 'image3', maxCount: 1 },
  { name: 'image4', maxCount: 1 }
]);

export async function uploadSuspect(req: Request, res: Response) {
  console.info('Starting uploadSuspect function');
  
  uploadSuspectImage(req, res, async function (err) {
    if (err) {
      console.error(`Error during file upload: ${err.message}`, { stack: err.stack });
      return res.status(500).json({ error: err.message });
    }

    console.info('File upload successful, processing request');

    try {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const allFiles = Object.values(files).flat();

      if (!allFiles || allFiles.length === 0) {
        console.warn('No image files uploaded');
        return res.status(400).json({ error: 'No image files uploaded' });
      }

      console.info(`Number of files uploaded: ${allFiles.length}`);

      const { name, age, lastLocation, country, gender } = req.body;

      const suspectData = {
        name,
        age: parseInt(age),
        lastLocation,
        country,
        gender,
        images: allFiles.map(file => ({
          filename: file.filename,
          originalName: file.originalname,
          mimetype: file.mimetype,
          size: file.size
        }))
      };

      console.info('Suspect data prepared', { suspectData: { ...suspectData, imageCount: suspectData.images.length } });

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

export async function recognizeFace(req: Request, res: Response) {
  uploadSingleImage(req, res, async function (err) {
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
      
      // Extract location and timestamp from the request body
      const { latitude, longitude, timestamp } = req.body;

      // Validate and parse the timestamp
      let parsedTimestamp: Date | null = null;
      if (timestamp) {
        parsedTimestamp = new Date(timestamp);
        if (isNaN(parsedTimestamp.getTime())) {
          parsedTimestamp = null;
        }
      }

      if (result.name !== 'unknown') {
        // Save the image details to the SuspectImage collection
        const newImage = new SuspectImage({
          filename: req.file.filename,
          name: result.name,
          distance: result.distance
        });
        await newImage.save();

        // Prepare the update object
        const updateObject: any = {
          $set: {
            lastLocation: latitude && longitude ? `${latitude},${longitude}` : undefined,
            located: true
          },
          $push: { images: newImage._id }
        };

        // Only set timeLocated if we have a valid timestamp
        if (parsedTimestamp) {
          updateObject.$set.timeLocated = parsedTimestamp;
        }

        // Update or create the Suspect document
        const suspect = await Suspect.findOneAndUpdate(
          { name: result.name },
          updateObject,
          { new: true, upsert: true }
        );

        console.log('Updated suspect:', suspect);
      }

      // Include location and timestamp in the response
      res.json({
        ...result,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        timestamp: parsedTimestamp ? parsedTimestamp.toISOString() : null
      });
    } catch (error: any) {
      console.error('Error in recognizeFace:', error);
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

