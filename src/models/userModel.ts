import { Schema } from "mongoose";
import { IUser } from "../types/userTypes";

export const UserSchema = new Schema<IUser>({
  firstName: {
    required: true,
    type: String,
  },

  email: {
    required: true,
    type: String,
    unique: true,
  },
  password: { type: String, required: true },


  token: {
    type: String,
  },

});
