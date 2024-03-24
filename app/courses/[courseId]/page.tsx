import prisma from "@/prisma/client";
import { redirect } from "next/navigation";

interface Props {
  params: { courseId: string };
}
const CoursePage = async ({ params }: Props) => {
  const course = await prisma.course.findUnique({
    where: { id: params.courseId },
  });
  if (!course) return <div>Course not found</div>;

  const firstSection = await prisma.section.findFirst({
    where: { courseId: course.id },
    orderBy: { title: "asc" },
    select: { id: true, title: true },
  });

  if (!firstSection) return <div>Invalid course</div>;

  if (firstSection) {
    const firstResource = await prisma.file.findFirst({
      where: { sectionId: firstSection.id },
      orderBy: { title: "asc" },
      select: { id: true },
    });
    if (!firstResource) return <div>Invalid resource</div>;
    return redirect(`/courses/${params.courseId}/${firstResource.id}`);
  }

  return <div>Invalid course id</div>;
};

export default CoursePage;
