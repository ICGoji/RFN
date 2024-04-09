export const isTeacher = (userId?: string | null) => {
  // return true;
  return userId === process.env.NEXT_PUBLIC_TEACHER_ID;
};
