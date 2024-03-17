import prisma from "@/prisma/client";
import { File } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

const fileSchema = z.object({
  title: z.string().min(1, "File name is required").max(255),
  sectionId: z.string().min(1, "Course id is required"),
  size: z.number().optional(),
  duration: z.number().optional(),
  type: z.string().min(1, "File type is required"),
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validation = fileSchema.safeParse(body);
  if (!validation.success)
    return NextResponse.json(
      { error: validation.error.format() },
      { status: 400 }
    );

  const { title, sectionId, size, duration, type }: File = body;
  const section = await prisma.section.findUnique({ where: { id: sectionId } });
  if (!section)
    return NextResponse.json({ error: "Invalid section id" }, { status: 400 });

  const file = await prisma.file.create({
    data: { title, sectionId, size, duration, type },
  });
  return NextResponse.json(file, { status: 201 });
}
