import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  const works = await prisma.work.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: true,
    },
  });

  return Response.json({ works });
}
