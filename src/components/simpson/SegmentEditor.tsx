"use client";

import type { SegmentRow } from "@/lib/simpson";
import { Button } from "@/components/ui/Button";

interface SegmentEditorProps {
  rows: SegmentRow[];
  labelA: string;
  labelB: string;
  onChange: (rows: SegmentRow[]) => void;
}

const NUMERIC_FIELDS: (keyof Omit<SegmentRow, "segment">)[] = ["aSuccess", "aTotal", "bSuccess", "bTotal"];

export function SegmentEditor({ rows, labelA, labelB, onChange }: SegmentEditorProps) {
  const update = (index: number, patch: Partial<SegmentRow>) => onChange(rows.map((r, i) => (i === index ? { ...r, ...patch } : r)));

  const remove = (index: number) => onChange(rows.filter((_, i) => i !== index));

  const add = () => onChange([...rows, { segment: `Nhóm khách ${rows.length + 1}`, aSuccess: 0, aTotal: 100, bSuccess: 0, bTotal: 100 }]);

  return (
    <div>
      <div className="-mx-1 overflow-x-auto px-1">
        <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-ink-500">
              <th className="min-w-[160px] pb-2 font-medium">Nhóm khách</th>
              <th className="pb-2 font-medium">{labelA}: thành công</th>
              <th className="pb-2 font-medium">{labelA}: tổng</th>
              <th className="pb-2 font-medium">{labelB}: thành công</th>
              <th className="pb-2 font-medium">{labelB}: tổng</th>
              <th className="pb-2" />
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              const invalid = row.aSuccess > row.aTotal || row.bSuccess > row.bTotal;
              return (
                <tr key={i} className="border-t border-ink-100">
                  <td className="py-1.5 pr-2">
                    <input
                      aria-label="Tên nhóm khách"
                      className="w-full rounded-md border border-transparent px-2 py-1.5 text-ink-900 hover:border-ink-200 focus:border-accent-500 focus:outline-none"
                      value={row.segment}
                      onChange={(e) => update(i, { segment: e.target.value })}
                    />
                  </td>
                  {NUMERIC_FIELDS.map((field) => (
                    <td key={field} className="py-1.5 pr-2">
                      <input
                        type="number"
                        min={0}
                        aria-label={field}
                        className={`w-full rounded-md border px-2 py-1.5 font-mono tabular-nums focus:outline-none ${
                          invalid ? "border-red-300 bg-red-50" : "border-ink-200 focus:border-accent-500"
                        }`}
                        value={row[field]}
                        onChange={(e) => update(i, { [field]: Math.max(0, Number(e.target.value) || 0) })}
                      />
                    </td>
                  ))}
                  <td className="py-1.5 text-right">
                    <button
                      type="button"
                      onClick={() => remove(i)}
                      className="rounded-md px-2 py-1 text-ink-400 hover:bg-ink-100 hover:text-ink-700"
                      aria-label={`Xóa ${row.segment}`}
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="mt-3">
        <Button onClick={add}>+ Thêm nhóm khách</Button>
      </div>
    </div>
  );
}
