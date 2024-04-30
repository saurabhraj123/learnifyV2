import authOptions from "@/app/api/auth/authOptions";
import prisma from "@/prisma/client";
import { Flex } from "@radix-ui/themes";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import VideoPlayer from "./VideoPlayer";
import Accordion from "./components/Accordion";

interface Props {
  params: { slug: string[] };
}

const CoursePage = async ({ params }: Props) => {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) return redirect("/");

  const [courseSlug, sectionNameParam, fileSlug] = params.slug;

  const course = await prisma.course.findFirst({
    where: {
      slug: courseSlug,
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

  const sectionName = sectionNameParam.replace(/%20/g, " ");

  const section = await prisma.section.findFirst({
    where: {
      title: sectionName,
      courseId: course!.id,
    },
  });

  const file = await prisma.file.findFirst({
    where: {
      slug: fileSlug,
      section: {
        title: sectionName,
      },
    },
    select: {
      title: true,
      slug: true,
    },
  });

  console.log({ file });

  return (
    <Flex>
      <VideoPlayer
        fileName={file!.title}
        courseName={course!.title}
        sectionName={sectionName}
      />
      <Accordion
        sections={course!.sections}
        activeSection={section}
        activeSectionName={sectionName}
        activeResourceSlug={file!.slug}
      />
    </Flex>
  );
};

export default CoursePage;
