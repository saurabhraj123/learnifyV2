import authOptions from "@/app/api/auth/authOptions";
import prisma from "@/prisma/client";
import { Flex } from "@radix-ui/themes";
import { getServerSession } from "next-auth";
import React from "react";
import VideoPlayer from "../VideoPlayer";

interface Props {
  params: { resourceId: string };
}

const ResourcePage = async ({ params }: Props) => {
  const session = await getServerSession(authOptions);
  if (!session) return <div>Please login to continue...</div>;

  const resource = await prisma.file.findFirst({
    where: {
      slug: params.resourceId,
      section: { course: { userId: (session.user as any)?.id } },
    },
    include: {
      section: {
        include: {
          course: true,
        },
      },
    },
  });

  if (!resource) return <div>Resource not found</div>;

  return (
    <Flex mx="5">
      <VideoPlayer
        courseName={resource.section.course.title}
        sectionName={resource.section.title}
        fileName={resource.title}
      />
    </Flex>
  );
};

export default ResourcePage;
