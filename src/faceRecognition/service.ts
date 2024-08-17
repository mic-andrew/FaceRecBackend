import * as faceapi from 'face-api.js';
import fs from 'fs/promises';
import path from 'path';
import { Canvas, Image, ImageData, createCanvas, loadImage } from 'canvas';
import Suspect from '../models/Suspects';

interface SuspectData {
  name: string;
  age: number;
  lastLocation: string;
  country: string;
  gender: string;
  images: string[];
}


// Monkey patch the environment without type assertions
(faceapi.env as any).monkeyPatch({ Canvas, Image, ImageData });

let modelsLoaded = false;
const labeledFaceDescriptors: faceapi.LabeledFaceDescriptors[] = [];

export async function loadModels() {
  if (!modelsLoaded) {
    const weightsPath = path.join(__dirname, '..', 'utils', 'weights');
    await faceapi.nets.faceRecognitionNet.loadFromDisk(weightsPath);
    await faceapi.nets.faceLandmark68Net.loadFromDisk(weightsPath);
    await faceapi.nets.ssdMobilenetv1.loadFromDisk(weightsPath);
    modelsLoaded = true;
    console.log('Models loaded successfully');
  }
}

export async function createFaceDescriptor(image: Buffer | string): Promise<Float32Array | null> {
  await loadModels(); // Ensure models are loaded
  const img = await loadImage(image);
  const detection = await faceapi.detectSingleFace(img as any)
    .withFaceLandmarks()
    .withFaceDescriptor();
  return detection ? detection.descriptor : null;
}

export async function loadLabeledImages() {
  if (labeledFaceDescriptors.length > 0) {
    return; // Labels already loaded
  }

  const labelsDir = path.join(__dirname, '..', 'utils', 'images');
  const files = await fs.readdir(labelsDir);

  for (const file of files) {
    const label = path.parse(file).name;
    console.info(`Loading label name of ${label}...`);
    const imgPath = path.join(labelsDir, file);
    const img = await fs.readFile(imgPath);
    const descriptor = await createFaceDescriptor(img);
    if (descriptor) {
      console.info(`Loaded descriptor for ${label}`);
      labeledFaceDescriptors.push(new faceapi.LabeledFaceDescriptors(label, [descriptor]));
    }
  }
}

export async function recognizeFaceInImage(imageData: Buffer) {
  await loadModels(); // Ensure models are loaded
  await loadLabeledImages(); // Ensure labeled images are loaded

  console.log("Number of labeled face descriptors:", labeledFaceDescriptors.length);

  try {
    const descriptor = await createFaceDescriptor(imageData);

    if (!descriptor) {
      return { error: 'No face detected' };
    }

    const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors);
    const bestMatch = faceMatcher.findBestMatch(descriptor);

    return { name: bestMatch.label, distance: bestMatch.distance };
  } catch (error) {
    console.error('Error in recognizeFaceInImage:', error);
    return { error: 'Failed to process image' };
  }
}



export async function uploadSuspectData(suspectData: SuspectData) {
  try {
    const suspect = new Suspect(suspectData);
    await suspect.save();

    return {
      message: 'Suspect data uploaded successfully',
      suspectId: suspect._id,
    };
  } catch (error) {
    console.error('Error uploading suspect data:', error);
    throw new Error('Failed to upload suspect data');
  }
}