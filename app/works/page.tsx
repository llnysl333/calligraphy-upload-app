import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

const scriptTypeLabels = {
  REGULAR: "楷书",
  RUNNING: "行书",
  CURSIVE: "草书",
  CLERICAL: "隶书",
  SEAL: "篆书",
  OTHER: "其他",
};

export default async function WorksPage() {
  const works = await prisma.work.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-stone-50 px-6 py-10 text-zinc-950">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <header className="flex flex-col gap-4 border-b border-zinc-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm text-zinc-500">Calligraphy Works</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-normal">
              作品列表
            </h1>
          </div>
          <Link
            className="inline-flex h-10 items-center justify-center rounded-md bg-zinc-950 px-4 text-sm font-medium text-white transition hover:bg-zinc-800"
            href="/upload"
          >
            上传作品
          </Link>
        </header>

        {works.length === 0 ? (
          <p className="rounded-lg border border-zinc-200 bg-white px-5 py-4 text-sm text-zinc-600">
            暂无作品
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {works.map((work) => (
              <article
                className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm"
                key={work.id}
              >
                <div className="relative aspect-[4/3] bg-zinc-100">
                  <Image
                    alt={work.title}
                    className="object-cover"
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    src={work.imageUrl}
                  />
                </div>
                <div className="flex flex-col gap-2 p-4">
                  <h2 className="text-lg font-semibold text-zinc-950">
                    {work.title}
                  </h2>
                  <div className="flex items-center justify-between gap-3 text-sm text-zinc-600">
                    <span>{scriptTypeLabels[work.scriptType]}</span>
                    <time dateTime={work.createdAt.toISOString()}>
                      {work.createdAt.toLocaleString("zh-CN", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </time>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
