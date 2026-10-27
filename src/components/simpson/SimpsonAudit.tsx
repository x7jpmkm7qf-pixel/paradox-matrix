"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Segmented } from "@/components/ui/Segmented";
import { SegmentEditor } from "./SegmentEditor";
import { CsvImport } from "./CsvImport";
import { RateComparisonChart } from "./RateComparisonChart";
import { AuditFindings } from "./AuditFindings";
import { analyseSimpson, SIMPSON_PRESETS, type SegmentRow } from "@/lib/simpson";

/** Module 2 – The Simpson's Audit Tool. */
export function SimpsonAudit() {
  const [presetId, setPresetId] = useState(SIMPSON_PRESETS[0].id);
  const preset = SIMPSON_PRESETS.find((p) => p.id === presetId) ?? SIMPSON_PRESETS[0];

  const [rows, setRows] = useState<SegmentRow[]>(preset.rows);
  const [labelA, setLabelA] = useState(preset.labelA);
  const [labelB, setLabelB] = useState(preset.labelB);
  const [metric, setMetric] = useState(preset.metric);

  const report = useMemo(() => analyseSimpson(rows), [rows]);

  const loadPreset = (id: string) => {
    const p = SIMPSON_PRESETS.find((x) => x.id === id);
    if (!p) return;
    setPresetId(id);
    setRows(p.rows);
    setLabelA(p.labelA);
    setLabelB(p.labelB);
    setMetric(p.metric);
  };

  return (
    <div className="space-y-6">
      <Card
        title="Dữ liệu phân khúc"
        subtitle="So sánh hai nhóm (đội, kênh, sản phẩm, chính sách giá) theo từng phân khúc. Sửa trực tiếp, dán hoặc tải CSV."
        actions={
          <Segmented
            ariaLabel="Bộ dữ liệu mẫu"
            value={presetId}
            onChange={loadPreset}
            options={SIMPSON_PRESETS.map((p) => ({ value: p.id, label: p.name }))}
          />
        }
      >
        <div className="mb-5 grid gap-3 sm:grid-cols-3">
          <TextField label="Tên nhóm A" value={labelA} onChange={setLabelA} />
          <TextField label="Tên nhóm B" value={labelB} onChange={setLabelB} />
          <TextField label="Chỉ số đang đo" value={metric} onChange={setMetric} />
        </div>
        <SegmentEditor rows={rows} labelA={labelA} labelB={labelB} onChange={setRows} />
        <div className="mt-5 border-t border-ink-100 pt-4">
          <CsvImport rows={rows} onImport={setRows} />
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card title={`${metric}: từng phân khúc vs tổng hợp`} subtitle="Nếu cột tổng hợp đảo chiều so với các phân khúc, bạn đang thấy nghịch lý Simpson.">
          <RateComparisonChart report={report} labelA={labelA || "A"} labelB={labelB || "B"} />
        </Card>
        <Card title="Kết quả kiểm toán">
          <AuditFindings report={report} labelA={labelA || "A"} labelB={labelB || "B"} metric={metric || "Tỷ lệ"} />
        </Card>
      </div>
    </div>
  );
}

function TextField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-ink-700">{label}</span>
      <input
        className="mt-1.5 w-full rounded-lg border border-ink-200 px-3 py-2 text-sm text-ink-900 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-100"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
