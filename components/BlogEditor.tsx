"use client";

import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

interface BlogEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function BlogEditor({
  value,
  onChange,
}: BlogEditorProps) {
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],

      ["bold", "italic", "underline", "strike"],

      [{ color: [] }, { background: [] }],

      [{ list: "ordered" }, { list: "bullet" }],

      [{ indent: "-1" }, { indent: "+1" }],

      [{ align: [] }],

      ["blockquote", "code-block"],

      ["link", "image", "video"],

      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "list",
    "bullet",
    "indent",
    "align",
    "blockquote",
    "code-block",
    "link",
    "image",
    "video",
  ];

  return (
    <div className="blog-editor">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder="เขียนเนื้อหาบทความ..."
      />
    </div>
  );
}