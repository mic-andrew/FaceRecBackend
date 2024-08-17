// models/Image.js

import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  name: { type: String, required: true },
  distance: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

const SuspectImage = mongoose.model('SuspectImage', imageSchema);

export default SuspectImage;
