import { Schema } from "mongoose";

export const Student = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  parentPhoneNumber: { type: String, required: true },
});


export const Teacher = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

export const Principal = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

export const Admin = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
});