import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { ScriptType } from "@/app/generated/prisma/enums";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const uploadDir = path.join(process.cwd(), "public", "uploads");

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("image");
  const title = formData.get("title");
  const description = formData.get("description");
  const scriptType = formData.get("scriptType");
  const isPublic = formData.get("isPublic");
  const normalizedTitle = typeof title === "string" ? title.trim() : "";

  if (!(file instanceof File)) {
    return Response.json({ error: "请上传 image 文件字段" }, { status: 400 });
  }

  if (!normalizedTitle) {
    return Response.json({ error: "请填写作品标题" }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return Response.json({ error: "只能上传图片文件" }, { status: 400 });
  }

  const normalizedScriptType =
    typeof scriptType === "string" && scriptType in ScriptType
      ? (scriptType as ScriptType)
      : ScriptType.OTHER;

  const extension = path.extname(file.name).toLowerCase() || ".png";
  const fileName = `${randomUUID()}${extension}`;
  const filePath = path.join(uploadDir, fileName);
  const imageUrl = `/uploads/${fileName}`;

  await mkdir(uploadDir, { recursive: true });
  await writeFile(filePath, Buffer.from(await file.arrayBuffer()));

  const work = await prisma.work.create({
    data: {
      title: normalizedTitle,
      description:
        typeof description === "string" && description.trim()
          ? description.trim()
          : null,
      scriptType: normalizedScriptType,
      isPublic: isPublic === "true",
      imageUrl,
      imagePath: filePath,
    },
  });

  return Response.json({ imageUrl, work }, { status: 201 });
}
