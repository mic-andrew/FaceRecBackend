import { Schema } from "mongoose";
import { EventTypes } from "../types/types";

export const EventSchema = new Schema<EventTypes>({
  title: {
    required: true,
    type: String,
  },
  description: {
    required: true,
    type: String,
  },
  image: {
    required: false,
    type: {},
  },
  date: {
    required: false,
    type: String,
  },
});
