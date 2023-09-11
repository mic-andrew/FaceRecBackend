import { Schema } from "mongoose";

export const ClassRoom = new Schema({
  name: { type: String, required: true },
  class_room: { type: Number, required: true },
});

export const Subject = new Schema({
  name: { type: String, required: true },
  class_offered: {
    type: Schema.Types.ObjectId,
    ref: "ClassRoom",
    required: true,
  },
  teacher: {
    type: Schema.Types.ObjectId,
    ref: "Teacher",
    required: true,
  },

});
