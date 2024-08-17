import mongoose from 'mongoose';

const suspectSchema = new mongoose.Schema({
  name: String,
  age: Number,
  lastLocation: String,
  country: String,
  gender: String,
  images: [String],
  createdAt: { type: Date, default: Date.now },
  currentLocation:  String
});

const Suspect = mongoose.model('Suspect', suspectSchema);

export default Suspect;