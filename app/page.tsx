import { Course, File, Section } from "@prisma/client";
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

  const courses = await prisma.course.findMany({
    where: {
      userId: (session.user as any).id,
    },
    include: {
      sections: {
        include: {
          files: {
            orderBy: {
              title: "asc",
            },
          },
        },
        orderBy: {
          title: "asc",
        },
      },
    },
  });

  return (
    <main>
      <Container mx="6">
        <Flex direction="column" gap="4">
          <AddCourse />
          {courses.map((course) => {
            const { lastOpenedResource, sections } = course;
            let sectionName: string | undefined;
            let resourceName: string | undefined;

            if (lastOpenedResource) {
              const section = sections.find((section) => {
                return section.files.find((file) => {
                  if (file.id === lastOpenedResource) {
                    resourceName = file.slug;
                    return true;
                  }
                });
              });

              sectionName = section!.title;
            } else {
              const section = sections[0];
              sectionName = section?.title;
              resourceName = section?.files[0]?.slug;
            }

            return (
              <Link
                key={course.id}
                href={
                  "/courses/" +
                  course.slug +
                  "/" +
                  sectionName +
                  "/" +
                  resourceName
                }
              >
                <CourseCard key={course.id} course={course} />
              </Link>
            );
          })}
        </Flex>
      </Container>
    </main>
  );
}
