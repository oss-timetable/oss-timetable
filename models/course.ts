import AsyncStorage from "@react-native-async-storage/async-storage";

type Lecture = {
  startDate: number;  // unix timestamp
  endDate: number;  // unix timestamp
  name: string;
  location: string;
  teacherName: string;
  periods: number;
  startIndex: number;
  endIndex: number;
  startHHMM: number;
  endHHMM: number;
  additionalInfo: { [key: string]: string };
};

type Homework = {
  name: string;
  index: number;
  deadline?: number;  // unix timestamp
  content: string;
  contentHTML: string;
};

type Exam = {
  startDate: number;  // unix timestamp
  endDate: number;  // unix timestamp
  name: string;
  location: string;
  examType: string;  // 期中/期末
  startHHMM: number;
  endHHMM: number;
  examMode: string;  // 开卷/闭卷
  additionalInfo: { [key: string]: string };
};

type Course = {
  id: string;
  name: string;
  courseCode: string;
  lessonCode: string;
  teacherName: string;
  lectures: Lecture[];
  exams: Exam[];
  homeworks: Homework[];
  dateTimePlacePersonText: string;
  courseType: string;
  courseGradation: string;
  courseCategory: string;
  educationType: string;
  classType: string;
  openDepartment: string;
  description: string;
  credit: number;
  additionalInfo: { [key: string]: string };
};

type Semester = {
  id: string;
  courses: Course[];
  name: string;
  startDate: number;  // unix timestamp
  endDate: number;  // unix timestamp
};

const getCourseIDs = async (): Promise<string[]> => {
  return ["153021", "153020", "158930"];

  // const ids = await AsyncStorage.getItem("courseIDs");
  // return ids ? JSON.parse(ids) : [];
};

const setCourseIDs = async (ids: string[]) => {
  await AsyncStorage.setItem("courseIDs", JSON.stringify(ids));
};

const addCourseID = async (id: string) => {
  const ids = await getCourseIDs();
  if (!ids.includes(id)) {
    ids.push(id);
    await setCourseIDs(ids);
  }
};

const removeCourseID = async (id: string) => {
  const ids = await getCourseIDs();
  const newIDs = ids.filter((i) => i !== id);
  await setCourseIDs(newIDs);
};

const getCourses = async (): Promise<Course[]> => {
  const ids = await getCourseIDs();
  const jobs = ids.map(async (id) => {
    const req = await fetch(`https://oss-timetable.github.io/ustc/api/course/${id}`);
    return await req.json();
  });
  return await Promise.all(jobs);
};

const getExams = async (): Promise<Exam[]> => {
  const courses = await getCourses();
  return courses.flatMap((course) => course.exams).sort((a, b) => a.startDate - b.startDate);
};

const getHomeworks = async (): Promise<Homework[]> => {
  const courses = await getCourses();
  return courses.flatMap((course) => course.homeworks).sort((a, b) => (a.deadline ?? 0) - (b.deadline ?? 0));
};

const getLectures = async (): Promise<Lecture[]> => {
  const courses = await getCourses();
  return courses.flatMap((course) => course.lectures).sort((a, b) => a.startDate - b.startDate);
};

const getTodayLectures = async (): Promise<Lecture[]> => {
  const lectures = await getLectures();
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime() / 1000;
  const todayEnd = todayStart + 24 * 60 * 60;
  return lectures.filter((lecture) => lecture.startDate >= todayStart && lecture.startDate < todayEnd);
};

const getTomorrowLectures = async (): Promise<Lecture[]> => {
  const lectures = await getLectures();
  const today = new Date();
  const tomorrowStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).getTime() / 1000;
  const tomorrowEnd = tomorrowStart + 24 * 60 * 60;
  return lectures.filter((lecture) => lecture.startDate >= tomorrowStart && lecture.startDate < tomorrowEnd);
};

const getUnfinishedHomeworks = async (): Promise<Homework[]> => {
  const homeworks = await getHomeworks();
  const now = new Date().getTime();
  return homeworks.filter((homework) => homework.deadline && homework.deadline > now);
};

const getUnfinishedExams = async (): Promise<Exam[]> => {
  const exams = await getExams();
  const now = new Date().getTime();
  return exams.filter((exam) => exam.startDate > now);
};

const getSemesters = async (): Promise<Semester[]> => {
  const req = await fetch("https://oss-timetable.github.io/ustc/api/semester");
  return await req.json();
};

const getCoursesBySemester = async (semesterID: string): Promise<Course[]> => {
  const req = await fetch(`https://oss-timetable.github.io/ustc/api/semester/${semesterID}`);
  return await req.json();
};

export const lectureDateString = (lecture: Lecture): string => {
  const HHMMtoHHMM = (hhmm: number) => {
    const hh = Math.floor(hhmm / 100);
    const mm = hhmm % 100;
    return `${hh.toString().padStart(2, "0")}:${mm.toString().padStart(2, "0")}`;
  };
  return `${HHMMtoHHMM(lecture.startHHMM)}-${HHMMtoHHMM(lecture.endHHMM)}`;
};

export const examDateString = (exam: Exam): string => {
  // MM-DD HH:MM - HH:MM
  const date = new Date(exam.startDate * 1000);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const HHMMtoHHMM = (hhmm: number) => {
    const hh = Math.floor(hhmm / 100);
    const mm = hhmm % 100;
    return `${hh.toString().padStart(2, "0")}:${mm.toString().padStart(2, "0")}`;
  };
  return `${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")} ${HHMMtoHHMM(exam.startHHMM)}-${HHMMtoHHMM(exam.endHHMM)}`;
};

export const examDateLeftString = (exam: Exam): string => {
  const now = new Date().getTime();
  const left = exam.startDate * 1000 - now;
  const days = Math.floor(left / (24 * 60 * 60 * 1000));
  const hours = Math.floor(left / (60 * 60 * 1000)) % 24;
  const minutes = Math.floor(left / (60 * 1000)) % 60;

  if (left <= 0) {
    if (exam.endDate * 1000 < now) {
      return "Finished";
    }
    return "WTF?";
  }

  if (days > 0) {
    return `${days} days left`;
  }
  if (hours > 0) {
    return `${hours} hours left`;
  }
  return `${minutes} minutes left`;
};

export const homeworkDeadlineString = (homework: Homework): string => {
  if (!homework.deadline) {
    return "No deadline";
  }
  const date = new Date(homework.deadline * 1000);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const HHMM = `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
  return `${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")} ${HHMM}`;
}

export const homeworkDateLeftString = (homework: Homework): string => {
  if (!homework.deadline) {
    return "No deadline";
  }
  const now = new Date().getTime();
  const left = homework.deadline * 1000 - now;
  const days = Math.floor(left / (24 * 60 * 60 * 1000));
  const hours = Math.floor(left / (60 * 60 * 1000)) % 24;
  const minutes = Math.floor(left / (60 * 1000)) % 60;

  if (left <= 0) {
    return "Overdue";
  }

  if (days > 0) {
    return `${days} days left`;
  }
  if (hours > 0) {
    return `${hours} hours left`;
  }
  return `${minutes} minutes left`;
};

export {
  Course,
  Lecture,
  Exam,
  Homework,
  Semester,
  getCourseIDs,
  setCourseIDs,
  addCourseID,
  removeCourseID,
  getCourses,
  getExams,
  getHomeworks,
  getLectures,
  getTodayLectures,
  getTomorrowLectures,
  getUnfinishedHomeworks,
  getUnfinishedExams,
  getSemesters,
  getCoursesBySemester
};