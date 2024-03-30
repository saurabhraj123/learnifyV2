import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import { createSlug } from "../utils";
import { getServerSession } from "next-auth";
import authOptions from "../auth/authOptions";

const courseSchema = z.object({
  title: z.string().min(1, "File name is required").max(255),
  userId: z.string().cuid(),
});

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const validation = courseSchema.safeParse(body);
  if (!validation.success)
    return NextResponse.json(
      { error: validation.error.format() },
      { status: 400 }
    );

  const { title, userId } = body;
  const course = await prisma.course.findFirst({
    where: { title, userId: (session.user as any)?.id },
  });
  if (course)
    return NextResponse.json(
      { error: "Course already exists" },
      { status: 409 }
    );

  const slug = createSlug(title);
  const newCourse = await prisma.course.create({
    data: { title, userId, slug: slug },
  });
  return NextResponse.json(newCourse, { status: 201 });
}

interface CoursePatchSchema {
  courseId: string;
  lastOpenedResourceSlug: string;
}

export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { courseId, lastOpenedResourceSlug }: CoursePatchSchema =
    await request.json();

  const course = await prisma.course.update({
    where: { id: courseId },
    data: { lastOpenedResource: lastOpenedResourceSlug },
  });

  return NextResponse.json(course);
}
