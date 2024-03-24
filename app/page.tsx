import { Course } from "@prisma/client";
import AddCourse from "./AddCourse";
import CourseCard from "./components/CourseCard";
import { Container, Flex } from "@radix-ui/themes";
import prisma from "@/prisma/client";
import Link from "next/link";
import { getServerSession } from "next-auth";
import authOptions from "./api/auth/authOptions";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) return <div>Please login first...</div>;

  const courses = await prisma.course.findMany();

  return (
    <main>
      <Container mx="6">
        <Flex direction="column" gap="4">
          <AddCourse />
          {courses.map((course) => (
            <Link key={course.id} href={"/courses/" + course.slug}>
              <CourseCard key={course.id} course={course} />
            </Link>
          ))}
        </Flex>
      </Container>
    </main>
  );
}
