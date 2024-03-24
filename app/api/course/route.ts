import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import { createSlug } from "../utils";

const courseSchema = z.object({
  title: z.string().min(1, "File name is required").max(255),
  userId: z.string().cuid(),
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validation = courseSchema.safeParse(body);
  if (!validation.success)
    return NextResponse.json(
      { error: validation.error.format() },
      { status: 400 }
    );

  const { title, userId } = body;
  const course = await prisma.course.findFirst({ where: { title } });
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
