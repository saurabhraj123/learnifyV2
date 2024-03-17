import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

const sectionSchema = z.object({
  title: z.string().min(1, "File name is required").max(255),
  courseId: z.string().min(1, "Course id is required"),
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validation = sectionSchema.safeParse(body);
  if (!validation.success)
    return NextResponse.json(
      { error: validation.error.format() },
      { status: 400 }
    );

  const { title, courseId } = body;
  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course)
    return NextResponse.json({ error: "Invalid course id" }, { status: 400 });

  const section = await prisma.section.create({ data: { title, courseId } });
  return NextResponse.json(section, { status: 201 });
}
