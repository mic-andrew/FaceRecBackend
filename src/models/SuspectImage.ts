import mongoose, { Document, Schema } from 'mongoose';

export interface SuspectImageDocument extends Document {
  suspect: Schema.Types.ObjectId;
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  createdAt: Date;
}

const suspectImageSchema = new Schema<SuspectImageDocument>({
  suspect: { type: Schema.Types.ObjectId, ref: 'Suspect' },
  filename: String,
  originalName: String,
  mimetype: String,
  size: Number,
  createdAt: { type: Date, default: Date.now }
});

const SuspectImage = mongoose.model<SuspectImageDocument>('SuspectImage', suspectImageSchema);

export default SuspectImage;