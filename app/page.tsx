import { Course } from "@prisma/client";
import AddCourse from "./AddCourse";
import CourseCard from "./components/CourseCard";
import { Container, Flex } from "@radix-ui/themes";
import prisma from "@/prisma/client";
import Link from "next/link";

export default async function Home() {
  const courses = await prisma.course.findMany();

  return (
    <main>
      <Container mx="6">
        <Flex direction="column" gap="4">
          <AddCourse />
          {courses.map((course) => (
            <Link href={"/courses/" + course.id} key={course.id}>
              <CourseCard key={course.id} course={course} />
            </Link>
          ))}
        </Flex>
      </Container>
    </main>
  );
}
