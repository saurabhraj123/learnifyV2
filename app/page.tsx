import { Course } from "@prisma/client";
import CourseCard from "./components/CourseCard";

export default function Home() {
  const course: Course = {
    id: "1",
    title: "Introduction to Computer Science",
    size: 1000,
    duration: 100000,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return (
    <main>
      <CourseCard course={course} />
    </main>
  );
}
