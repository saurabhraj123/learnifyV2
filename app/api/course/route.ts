import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

const courseSchema = z.object({
  title: z.string().min(1, "File name is required").max(255),
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validation = courseSchema.safeParse(body);
  if (!validation.success)
    return NextResponse.json(
      { error: validation.error.format() },
      { status: 400 }
    );

  const { title } = body;
  const course = await prisma.course.findFirst({ where: { title } });
  if (course)
    return NextResponse.json(
      { error: "Course already exists" },
      { status: 409 }
    );

  const newCourse = await prisma.course.create({ data: { title } });
  return NextResponse.json(newCourse, { status: 201 });
}
