import { Schema } from "mongoose";
import { UserSchema } from "./userModel";
const extendSchema = require("mongoose-extend-schema");

export const StudentScema = extendSchema(UserSchema, {
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  studentClass: { type: String },
  dateOfBirth: { type: String },
});

export const TeacherSchema = extendSchema(UserSchema, {
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

export const PrincipalSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

export const AdminSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
});
