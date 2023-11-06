import { models } from "../models";
import { EventTypes } from "../types/types";

export const viewTeachersOrStudentsService = async (role: string) => {
  const findAll =
    role === "teacher"
      ? await models.Teacher.find()
      : await models.Student.find();
  return findAll;
};

export const saveEventToDb = async (events: EventTypes) => {
  try {
    const createEvent = await models.Event.create(events);
    console.log("service", createEvent);
    return createEvent;
  } catch (e) {
    console.log(e);
  }
};


export const getAllEventsService = async () => {
  try {
    const events = await models.Event.find();
    return events

  } catch (e) {
    console.log('err', e)
  }


}