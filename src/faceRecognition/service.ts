import * as faceapi from 'face-api.js';
import fs from 'fs/promises';
import path from 'path';
import { Canvas, Image, ImageData, createCanvas, loadImage } from 'canvas';
import Suspect from '../models/Suspects';
import SuspectImage from '../models/SuspectImage';



interface SuspectData {
  name: string;
  age: number;
  lastLocation: string;
  country: string;
  gender: string;
  images: {
    filename: string;
    originalName: string;
    mimetype: string;
    size: number;
  }[];
}

const uploadDir = process.env.UPLOADS_DIR || path.join(__dirname, '..', 'uploads');
const weightsPath = process.env.WEIGHTS_DIR || path.join(__dirname, '..', 'weights');



// Monkey patch the environment without type assertions
(faceapi.env as any).monkeyPatch({ Canvas, Image, ImageData });

let modelsLoaded = false;
const labeledFaceDescriptors: faceapi.LabeledFaceDescriptors[] = [];

export async function loadModels() {
  console.log('Loading models from path:', weightsPath);
  if (!modelsLoaded) {
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
  try {
    const suspects = await Suspect.find().populate({
      path: 'images',
      model: SuspectImage
    });
    
    const labeledDescriptors = [];

    for (const suspect of suspects) {
      console.log("Suspect:", JSON.stringify(suspect, null, 2));
      
      if (!Array.isArray(suspect.images)) {
        console.error(`Suspect ${suspect._id} has non-array images:`, suspect.images);
        continue;  // Skip this suspect and move to the next
      }

      for (const image of suspect.images) {
        console.log("Image:", JSON.stringify(image, null, 2));
        
        if (!(image instanceof SuspectImage)) {
          console.error(`Invalid image for suspect ${suspect._id}:`, image);
          continue;  // Skip this image and move to the next
        }

        const imagePath = path.join(uploadDir, image.filename);
        console.log("Full image path:", imagePath);

        try {
          const img = await fs.readFile(imagePath);
          const descriptor = await createFaceDescriptor(img);
          if (descriptor) {
            labeledDescriptors.push(new faceapi.LabeledFaceDescriptors(suspect._id.toString(), [descriptor]));
          }
        } catch (error) {
          console.error(`Error processing image ${image.filename} for suspect ${suspect._id}:`, error);
        }
      }
    }

    console.log("Number of labeled face descriptors:", labeledDescriptors.length);
    return labeledDescriptors;
  } catch (error) {
    console.error("Error in loadLabeledImages:", error);
    throw error;
  }
}


export async function recognizeFaceInImage(imageData: Buffer) {
  await loadModels(); // Ensure models are loaded
  const labeledDescriptors = await loadLabeledImages(); // Load labeled images

  console.log("Number of labeled face descriptors:", labeledDescriptors.length);

  try {
    const descriptor = await createFaceDescriptor(imageData);

    if (!descriptor) {
      return { error: 'No face detected in the uploaded image' };
    }

    if (labeledDescriptors.length === 0) {
      return { error: 'No labeled faces available for comparison' };
    }

    const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors);
    const bestMatch = faceMatcher.findBestMatch(descriptor);

    if (bestMatch.label !== 'unknown') {
      // A match was found, update the suspect's information
      const suspectId = bestMatch.label; // This is the suspect's ID
      const suspect = await Suspect.findByIdAndUpdate(
        suspectId,
        { 
          located: true, 
          timeLocated: new Date() 
        },
        { new: true } // This option returns the updated document
      );

      if (suspect) {
        return { 
          name: suspect.name, 
          distance: bestMatch.distance,
          timeLocated: suspect.timeLocated
        };
      } else {
        console.error(`Suspect with ID ${suspectId} not found in database.`);
        return { error: 'Matching suspect not found in database' };
      }
    } else {
      return { name: 'unknown', distance: bestMatch.distance };
    }
  } catch (error) {
    console.error('Error in recognizeFaceInImage:', error);
    return { error: 'Failed to process image' };
  }
}


export async function uploadSuspectData(suspectData: SuspectData) {
  const session = await Suspect.startSession();
  session.startTransaction();

  try {
    const suspect = new Suspect({
      name: suspectData.name,
      age: suspectData.age,
      lastLocation: suspectData.lastLocation,
      country: suspectData.country,
      gender: suspectData.gender,
    });

    await suspect.save({ session });

    const imagePromises = suspectData.images.map(async (imageData) => {
      const suspectImage = new SuspectImage({
        suspect: suspect._id,
        filename: imageData.filename,
        originalName: imageData.originalName,
        mimetype: imageData.mimetype,
        size: imageData.size
      });

      await suspectImage.save({ session });
      return suspectImage._id;
    });

    const imageIds = await Promise.all(imagePromises);

    suspect.images = imageIds;
    await suspect.save({ session });

    await session.commitTransaction();
    session.endSession();

    return {
      message: 'Suspect data uploaded successfully',
      suspectId: suspect._id,
      imageIds: imageIds
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('Error uploading suspect data:', error);
    throw error;
  }
}



export async function fetchSuspects() {
  try {
    const suspects = await Suspect.find()
      .populate({
        path: 'images',
        model: SuspectImage,
        select: 'filename' // We only need the filename
      })
      .select('-__v')
      .lean();

    console.log("------> fetching suspects", suspects);
    return suspects;
  } catch (error) {
    console.error('Error in fetchSuspects service:', error);
    throw error;
  }
}