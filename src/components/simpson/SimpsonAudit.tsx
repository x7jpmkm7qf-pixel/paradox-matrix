"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Segmented } from "@/components/ui/Segmented";
import { SegmentEditor } from "./SegmentEditor";
import { CsvImport } from "./CsvImport";
import { RateComparisonChart } from "./RateComparisonChart";
import { AuditFindings } from "./AuditFindings";
import { VerdictGate } from "@/components/pro/VerdictGate";
import { analyseSimpson, SIMPSON_PRESETS, type SegmentRow } from "@/lib/simpson";

const SEVERITY_SUMMARY = {
  paradox: "Con số tổng đang đánh lừa, nhóm thua ở tổng lại thắng ở mọi nhóm khách",
  partial: "Dấu hiệu nghịch đảo một phần, không nên quyết từ số tổng",
  consistent: "Số tổng nhất quán với từng nhóm khách",
  insufficient: "Chưa đủ nhóm khách để kết luận",
} as const;

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
        title="Nhập số liệu của bạn"
        subtitle="So sánh 2 đội, 2 kênh hay 2 sản phẩm, tách theo từng nhóm khách. Bấm vào ô để sửa số, hoặc chọn một ví dụ có sẵn bên phải."
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
        <Card
          title={`${metric}: từng nhóm khách so với con số tổng`}
          subtitle="Nếu cột Tổng ngược chiều với các nhóm khách, con số tổng đang đánh lừa bạn."
        >
          <RateComparisonChart report={report} labelA={labelA || "A"} labelB={labelB || "B"} />
        </Card>
        <Card title="Kết quả">
          <VerdictGate
            tool="simpson"
            fingerprint={JSON.stringify(rows)}
            isSample={SIMPSON_PRESETS.some((p) => JSON.stringify(p.rows) === JSON.stringify(rows))}
            summary={`${SEVERITY_SUMMARY[report.severity]} (${labelA} vs ${labelB}, ${metric})`}
          >
            <AuditFindings report={report} labelA={labelA || "A"} labelB={labelB || "B"} metric={metric || "Tỷ lệ"} />
          </VerdictGate>
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
