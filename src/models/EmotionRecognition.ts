import mongoose, { Document, Schema } from 'mongoose';

export interface EmotionRecognitionDocument extends Document {
  imageFilename: string;
  emotions: {
    angry: number;
    disgusted: number;
    fearful: number;
    happy: number;
    neutral: number;
    sad: number;
    surprised: number;
  };
  dominantEmotion: string;
  createdAt: Date;
}

const emotionRecognitionSchema = new Schema<EmotionRecognitionDocument>({
  imageFilename: { type: String, required: true },
  emotions: {
    angry: Number,
    disgusted: Number,
    fearful: Number,
    happy: Number,
    neutral: Number,
    sad: Number,
    surprised: Number
  },
  dominantEmotion: String,
  createdAt: { type: Date, default: Date.now }
});

const EmotionRecognition = mongoose.model<EmotionRecognitionDocument>('EmotionRecognition', emotionRecognitionSchema);

export default EmotionRecognition;