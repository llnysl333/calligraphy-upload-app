import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const uploadDir = path.join(process.cwd(), "public", "uploads");

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("image");
  const title = formData.get("title");

  if (!(file instanceof File)) {
    return Response.json({ error: "请上传 image 文件字段" }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return Response.json({ error: "只能上传图片文件" }, { status: 400 });
  }

  const extension = path.extname(file.name).toLowerCase() || ".png";
  const fileName = `${randomUUID()}${extension}`;
  const filePath = path.join(uploadDir, fileName);
  const imageUrl = `/uploads/${fileName}`;

  await mkdir(uploadDir, { recursive: true });
  await writeFile(filePath, Buffer.from(await file.arrayBuffer()));

  const work = await prisma.work.create({
    data: {
      title: typeof title === "string" && title.trim() ? title.trim() : null,
      imageUrl,
      imagePath: filePath,
    },
  });

  return Response.json({ imageUrl, work }, { status: 201 });
}
