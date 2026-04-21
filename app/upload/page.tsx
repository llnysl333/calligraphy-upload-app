"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type UploadResponse = {
  imageUrl?: string;
  error?: string;
};

type UploadStatus =
  | { type: "success"; imageUrl: string }
  | { type: "error"; message: string }
  | null;

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [scriptType, setScriptType] = useState("REGULAR");
  const [isPublic, setIsPublic] = useState(true);
  const [status, setStatus] = useState<UploadStatus>(null);
  const [isUploading, setIsUploading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus(null);

    if (!title.trim()) {
      setStatus({ type: "error", message: "请填写作品标题" });
      return;
    }

    if (!file) {
      setStatus({ type: "error", message: "请选择一张图片" });
      return;
    }

    const formData = new FormData();
    formData.append("image", file);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("scriptType", scriptType);
    formData.append("isPublic", String(isPublic));

    setIsUploading(true);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = (await response.json()) as UploadResponse;

      if (!response.ok) {
        setStatus({ type: "error", message: data.error ?? "上传失败" });
        return;
      }

      if (!data.imageUrl) {
        setStatus({ type: "error", message: "上传成功但没有返回图片 URL" });
        return;
      }

      setStatus({ type: "success", imageUrl: data.imageUrl });
      setTitle("");
      setDescription("");
      setScriptType("REGULAR");
      setIsPublic(true);
      setFile(null);
      form.reset();
    } catch {
      setStatus({ type: "error", message: "上传请求失败" });
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <main className="min-h-screen bg-stone-50 px-6 py-10 text-zinc-950">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-8">
        <header className="flex flex-col gap-4 border-b border-zinc-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm text-zinc-500">Calligraphy Works</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-normal">
              上传书法图片
            </h1>
          </div>
          <Link
            className="inline-flex h-10 items-center justify-center rounded-md border border-zinc-300 px-4 text-sm font-medium transition hover:bg-zinc-100"
            href="/works"
          >
            返回作品列表
          </Link>
        </header>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm"
        >
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-zinc-700">作品标题 *</span>
            <input
              required
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="h-11 rounded-md border border-zinc-300 px-3 text-base outline-none transition focus:border-zinc-900"
              placeholder="请输入作品标题"
              type="text"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-zinc-700">作品描述</span>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="min-h-28 rounded-md border border-zinc-300 px-3 py-2 text-base outline-none transition focus:border-zinc-900"
              placeholder="可选"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-zinc-700">书体类型</span>
            <select
              value={scriptType}
              onChange={(event) => setScriptType(event.target.value)}
              className="h-11 rounded-md border border-zinc-300 bg-white px-3 text-base outline-none transition focus:border-zinc-900"
            >
              <option value="REGULAR">楷书</option>
              <option value="RUNNING">行书</option>
              <option value="CURSIVE">草书</option>
              <option value="CLERICAL">隶书</option>
              <option value="SEAL">篆书</option>
              <option value="OTHER">其他</option>
            </select>
          </label>

          <label className="flex items-center gap-3 text-sm font-medium text-zinc-700">
            <input
              checked={isPublic}
              className="h-4 w-4 accent-zinc-950"
              type="checkbox"
              onChange={(event) => setIsPublic(event.target.checked)}
            />
            公开展示
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-zinc-700">图片文件</span>
            <input
              accept="image/*"
              className="rounded-md border border-dashed border-zinc-300 bg-zinc-50 px-3 py-4 text-sm file:mr-4 file:rounded-md file:border-0 file:bg-zinc-900 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white"
              type="file"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            />
          </label>

          <button
            className="h-11 rounded-md bg-zinc-950 px-4 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-400"
            disabled={isUploading}
            type="submit"
          >
            {isUploading ? "上传中..." : "上传"}
          </button>
        </form>

        {status?.type === "error" ? (
          <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {status.message}
          </p>
        ) : null}

        {status?.type === "success" ? (
          <section className="flex flex-col gap-4 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
            <div>
              <p className="text-sm font-medium text-zinc-700">上传成功</p>
              <a
                className="mt-1 block break-all text-sm text-zinc-600 underline"
                href={status.imageUrl}
                target="_blank"
                rel="noreferrer"
              >
                {status.imageUrl}
              </a>
            </div>
            <div className="relative h-[520px] overflow-hidden rounded-md border border-zinc-200 bg-zinc-50">
              <Image
                alt="上传的书法作品"
                className="object-contain"
                fill
                src={status.imageUrl}
              />
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
