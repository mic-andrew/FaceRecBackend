import mongoose, { Document, Schema } from 'mongoose';
import { SuspectImageDocument } from './SuspectImage';

export interface SuspectDocument extends Document {
  name: string;
  age: number;
  lastLocation: string;
  country: string;
  gender: string;
  images: SuspectImageDocument['_id'][];
  createdAt: Date;
  located: boolean;
  timeLocated?: Date;
}

const suspectSchema = new Schema<SuspectDocument>({
  name: String,
  age: Number,
  lastLocation: String,
  country: String,
  gender: String,
  images: {
    type: [{ type: Schema.Types.ObjectId, ref: 'SuspectImage' }],
    default: []
  },
  createdAt: { type: Date, default: Date.now },
  located: { type: Boolean, default: false },
  timeLocated: { type: Date, default: null }
});

const Suspect = mongoose.model<SuspectDocument>('Suspect', suspectSchema);

export default Suspect;