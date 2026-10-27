import { Alert } from "@/components/ui/Alert";
import { Stat } from "@/components/ui/Stat";
import type { SimpsonReport, Winner } from "@/lib/simpson";
import { num, pct } from "@/lib/format";

interface AuditFindingsProps {
  report: SimpsonReport;
  labelA: string;
  labelB: string;
  metric: string;
}

export function AuditFindings({ report, labelA, labelB, metric }: AuditFindingsProps) {
  const name = (w: Winner) => (w === "A" ? labelA : w === "B" ? labelB : "Hòa");
  const { total, segmentWins, severity, mostSkewedSegment: skew } = report;

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat
          label={`Tổng hợp: ${metric.toLowerCase()}`}
          value={name(total.winner)}
          caption={`${labelA} ${pct(total.aRate)} · ${labelB} ${pct(total.bRate)}`}
        />
        <Stat
          label="Thắng theo phân khúc"
          value={`${segmentWins.A} : ${segmentWins.B}`}
          caption={`${labelA} : ${labelB} trên ${report.segments.length} phân khúc`}
        />
        <Stat
          label="Sau khi chuẩn hóa cơ cấu"
          value={name(report.adjustedWinner)}
          caption={`${labelA} ${pct(report.aRateAdjusted)} · ${labelB} ${pct(report.bRateAdjusted)}`}
          emphasis
        />
      </div>

      {severity === "paradox" && (
        <Alert tone="danger" title="Phát hiện nghịch lý Simpson">
          Số liệu tổng hợp nói <b>{name(total.winner)}</b> tốt hơn, nhưng <b>{name(total.winner === "A" ? "B" : "A")}</b> thắng ở{" "}
          <b>mọi</b> phân khúc. Kết luận dựa trên con số tổng là sai: bạn có thể đang cắt nhầm đội, nhầm kênh, nhầm sản phẩm.
        </Alert>
      )}
      {severity === "partial" && (
        <Alert tone="warning" title="Dấu hiệu nghịch đảo một phần">
          Con số tổng hợp ủng hộ <b>{name(total.winner)}</b>, nhưng phần lớn phân khúc hoặc kết quả đã chuẩn hóa cơ cấu lại nghiêng về
          phía còn lại. Đừng ra quyết định chỉ từ số tổng.
        </Alert>
      )}
      {severity === "consistent" && (
        <Alert tone="success" title="Không phát hiện nghịch đảo">
          Kết luận từ số tổng hợp nhất quán với dữ liệu từng phân khúc.
        </Alert>
      )}
      {severity === "insufficient" && (
        <Alert tone="info" title="Cần ít nhất 2 phân khúc hợp lệ">
          Thêm phân khúc (theo khu vực, loại khách, thiết bị...) để kiểm tra nghịch lý.
        </Alert>
      )}

      {skew && severity !== "insufficient" && (
        <div className="rounded-xl border border-ink-200 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-ink-500">Biến gây nhiễu nằm ở đâu?</p>
          <p className="mt-2 text-sm leading-relaxed text-ink-700">
            Cơ cấu dữ liệu lệch nhiều nhất ở phân khúc <b>{skew.segment}</b>: chiếm {pct(skew.aMix, 0)} dữ liệu của {labelA} nhưng{" "}
            {pct(skew.bMix, 0)} của {labelB}. Khi hai nhóm có tỷ trọng phân khúc khác nhau, con số tổng phản ánh <i>cơ cấu</i> nhiều
            hơn là <i>hiệu quả</i>.
          </p>
          <MixTable report={report} labelA={labelA} labelB={labelB} />
        </div>
      )}
    </div>
  );
}

function MixTable({ report, labelA, labelB }: { report: SimpsonReport; labelA: string; labelB: string }) {
  return (
    <div className="-mx-1 mt-3 overflow-x-auto px-1">
      <table className="w-full min-w-[480px] text-sm">
        <thead>
          <tr className="text-left text-xs uppercase tracking-wide text-ink-500">
            <th className="pb-2 font-medium">Phân khúc</th>
            <th className="pb-2 text-right font-medium">Tỷ trọng {labelA}</th>
            <th className="pb-2 text-right font-medium">Tỷ trọng {labelB}</th>
            <th className="pb-2 text-right font-medium">Tỷ lệ {labelA}</th>
            <th className="pb-2 text-right font-medium">Tỷ lệ {labelB}</th>
          </tr>
        </thead>
        <tbody className="font-mono tabular-nums">
          {report.segments.map((s) => (
            <tr key={s.segment} className="border-t border-ink-100">
              <td className="py-1.5 font-sans text-ink-800">{s.segment}</td>
              <td className="py-1.5 text-right">{pct(s.aMix, 0)}</td>
              <td className="py-1.5 text-right">{pct(s.bMix, 0)}</td>
              <td className={`py-1.5 text-right ${s.winner === "A" ? "font-semibold text-accent-700" : ""}`}>{pct(s.aRate)}</td>
              <td className={`py-1.5 text-right ${s.winner === "B" ? "font-semibold text-amber-700" : ""}`}>{pct(s.bRate)}</td>
            </tr>
          ))}
          <tr className="border-t border-ink-200 font-semibold">
            <td className="py-1.5 font-sans">Tổng ({num(report.total.aTotal)} / {num(report.total.bTotal)})</td>
            <td className="py-1.5 text-right">100%</td>
            <td className="py-1.5 text-right">100%</td>
            <td className="py-1.5 text-right">{pct(report.total.aRate)}</td>
            <td className="py-1.5 text-right">{pct(report.total.bRate)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
