import { models } from "../models";

export const viewTeachersOrStudentsService = async (role: string) => {
  const findAll =
    role === "teacher"
      ? await models.Teacher.find()
      : await models.Student.find();
  return findAll;
};
