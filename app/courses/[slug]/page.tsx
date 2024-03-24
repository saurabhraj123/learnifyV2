import authOptions from "@/app/api/auth/authOptions";
import prisma from "@/prisma/client";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

interface Props {
  params: { slug: string };
}
const CoursePage = async ({ params }: Props) => {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) return redirect("/");

  const course = await prisma.course.findUnique({
    where: { slug: params.slug, userId: (session.user as any)?.id },
  });
  if (!course) return <div>Course not found</div>;

  const { lastOpenedResource } = course;
  if (lastOpenedResource)
    return redirect(`/courses/${params.slug}/${lastOpenedResource}`);

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
      select: { id: true, slug: true },
    });
    if (!firstResource) return <div>Invalid resource</div>;
    return redirect(`/courses/${params.slug}/${firstResource.slug}`);
  }

  return <div>Invalid course id</div>;
};

export default CoursePage;
