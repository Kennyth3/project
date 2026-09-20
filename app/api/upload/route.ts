"use client";

import { FormEvent, useState } from "react";

function createSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9ก-๙-]/g, "");
}

import dynamic from "next/dynamic";

const BlogEditor = dynamic(
  () => import("@/components/BlogEditor"),
  {
    ssr: false,
    loading: () => (
      <div className="border rounded-lg p-6">
        กำลังโหลด Editor...
      </div>
    ),
  }
);

export default function NewBlogPage() {
  const [title, setTitle] = useState<string>("");
  const [slug, setSlug] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!title.trim()) {
      alert("กรุณากรอกชื่อบทความ");
      return;
    }

    if (!content.trim()) {
      alert("กรุณากรอกเนื้อหาบทความ");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/blogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          slug,
          content,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "สร้างบทความไม่สำเร็จ"
        );
      }

      alert("สร้างบทความสำเร็จ");

      setTitle("");
      setSlug("");
      setContent("");
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "เกิดข้อผิดพลาด"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">
        สร้างบทความ
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* Title */}
        <div>
          <label className="block mb-2 font-medium">
            ชื่อบทความ
          </label>

          <input
            type="text"
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
              setSlug(createSlug(event.target.value));
            }}
            placeholder="ชื่อบทความ"
            className="w-full border rounded-lg px-4 py-3"
          />
        </div>

        {/* Content */}
        <div>
          <label className="block mb-2 font-medium">
            เนื้อหาบทความ
          </label>

          <BlogEditor
            value={content}
            onChange={setContent}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 rounded-lg bg-black text-white disabled:opacity-50"
        >
          {loading
            ? "กำลังบันทึก..."
            : "บันทึกบทความ"}
        </button>
      </form>
    </main>
  );
}