import * as faceapi from 'face-api.js';
import { Canvas, Image } from 'canvas';
import fs from 'fs/promises';
import path from 'path';
import EmotionRecognition from '../models/EmotionRecognition';
import dotenv from 'dotenv';


const uploadDir = process.env.UPLOADS_DIR || path.join(__dirname, '..', 'uploads');
const weightsPath = process.env.WEIGHTS_DIR ||path.join(__dirname, '..', 'utils', 'weights');

// Monkey patch the environment
(faceapi.env as any).monkeyPatch({ Canvas, Image });



if (!uploadDir || !weightsPath) {
  console.error('UPLOADS_DIR or WEIGHTS_DIR not set in environment variables');
//   process.exit(1);
}

export async function recognizeEmotion(imagePath: string, imageFilename: string) {
    
console.log('UPLOADS_DIR: in recog service', uploadDir);
console.log('WEIGHTS_DIR:', weightsPath);
  try {
    // Load the face-api.js models
    await faceapi.nets.faceExpressionNet.loadFromDisk(`${weightsPath}`);
    await faceapi.nets.ssdMobilenetv1.loadFromDisk(`${weightsPath}`);

    // Read the image file
    const imageBuffer = await fs.readFile(imagePath);

    console.log('Image buffer:', imageBuffer);

    // Create a canvas from the image buffer
    const img = new Image();
    img.src = imageBuffer;

    const canvas = new Canvas(img.width, img.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, img.width, img.height);

    const detections = await faceapi.detectAllFaces(canvas as any).withFaceExpressions();

    console.log('Detections:', detections);

    if (detections.length === 0) {
      throw new Error('No faces detected in the image');
    }

    const emotions = detections[0].expressions;
    const dominantEmotion = Object.entries(emotions).reduce((a, b) => a[1] > b[1] ? a : b)[0];

    const emotionRecognition = new EmotionRecognition({
      imageFilename,
      emotions,
      dominantEmotion,
      createdAt: new Date()
    });

    await emotionRecognition.save();

    return {
      emotions,
      dominantEmotion
    };
  } catch (error) {
    console.error('Error in recognizeEmotion:', error);
    throw error;
  }
}

export async function getEmotionHistory() {
  const history = await EmotionRecognition.find().sort({ createdAt: -1 });
  return history.map(entry => ({
    ...entry.toObject(),
    imageUrl: `/uploads/${entry.imageFilename}`
  }));
}