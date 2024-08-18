import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Use fs.promises for async operations
const fsPromises = fs.promises;

// Get uploads directory from environment variable
const uploadDir = process.env.UPLOADS_DIR || path.join(__dirname, '..', 'uploads');

console.log('Upload directory path:', uploadDir);

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  console.log(`Creating upload directory: ${uploadDir}`);
  try {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log('Upload directory created successfully');
  } catch (err) {
    console.error(`Failed to create upload directory: ${err}`);
    throw err; // This will crash the app if we can't create the directory
  }
}

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

const uploadSuspectImage = multer({
  storage: storage,
  fileFilter: fileFilter
}).fields([
  { name: 'image0', maxCount: 1 },
  { name: 'image1', maxCount: 1 },
  { name: 'image2', maxCount: 1 },
  { name: 'image3', maxCount: 1 },
  { name: 'image4', maxCount: 1 }
]);

const uploadSingleImage = multer({
  storage: storage,
  fileFilter: fileFilter
}).single('image');


export {
  uploadSuspectImage,
  uploadSingleImage
}