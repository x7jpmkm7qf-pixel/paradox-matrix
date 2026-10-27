"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { ProButton } from "@/components/pro/ProButton";
import { parseSegmentCsv, toCsv, type SegmentRow } from "@/lib/simpson";

interface CsvImportProps {
  rows: SegmentRow[];
  onImport: (rows: SegmentRow[]) => void;
}

export function CsvImport({ rows, onImport }: CsvImportProps) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const apply = (raw: string) => {
    const parsed = parseSegmentCsv(raw);
    setErrors(parsed.errors);
    if (parsed.rows.length > 0) {
      onImport(parsed.rows);
      if (parsed.errors.length === 0) setOpen(false);
    } else if (parsed.errors.length === 0) {
      setErrors(["Không tìm thấy dòng dữ liệu hợp lệ."]);
    }
  };

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    const content = await file.text();
    setText(content);
    apply(content);
  };

  const download = () => {
    const blob = new Blob([toCsv(rows)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "paradox-matrix-segments.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <ProButton feature="Dán CSV" onClick={() => setOpen((o) => !o)}>
          {open ? "Đóng nhập liệu" : "Dán CSV"}
        </ProButton>
        <ProButton feature="Tải file CSV" onClick={() => fileRef.current?.click()}>
          Tải file CSV
        </ProButton>
        <ProButton feature="Xuất CSV" onClick={download}>
          Xuất CSV
        </ProButton>
        <input
          ref={fileRef}
          type="file"
          accept=".csv,.tsv,.txt,text/csv"
          className="hidden"
          onChange={(e) => {
            onFile(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
      </div>

      {open && (
        <div className="mt-3 space-y-2">
          <textarea
            className="h-32 w-full rounded-lg border border-ink-200 p-3 font-mono text-xs focus:border-accent-500 focus:outline-none"
            placeholder={"segment,A_success,A_total,B_success,B_total\nKhách SME,81,87,234,270\nKhách lớn,192,263,55,80"}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-ink-500">5 cột: tên phân khúc, A thành công, A tổng, B thành công, B tổng. Hỗ trợ dấu phẩy, chấm phẩy, tab.</p>
            <Button variant="primary" onClick={() => apply(text)}>
              Phân tích
            </Button>
          </div>
        </div>
      )}

      {errors.length > 0 && (
        <ul className="mt-2 space-y-0.5 text-xs text-red-600">
          {errors.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
