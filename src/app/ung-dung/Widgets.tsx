"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/Slider";
import { num, pct } from "@/lib/format";
import type { WidgetId } from "./content";

/** Chance that at least two of n people share a birthday. */
export function sharedBirthday(n: number): number {
  let none = 1;
  for (let i = 0; i < n; i++) none *= (365 - i) / 365;
  return 1 - none;
}

function Frame({ title, note, children }: { title: string; note?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-ink-200 bg-ink-50 p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-accent-700">Tự tay thử · {title}</p>
      <div className="mt-4">{children}</div>
      {note && <p className="mt-4 text-xs leading-relaxed text-ink-500">{note}</p>}
    </div>
  );
}

function BirthdayWidget() {
  const [n, setN] = useState(30);
  const p = sharedBirthday(n);
  const pairs = (n * (n - 1)) / 2;
  return (
    <Frame title="Nhóm khách của bạn có bao nhiêu người?">
      <Slider label="Số khách trong nhóm" value={n} min={5} max={100} onChange={setN} format={(v) => `${v} người`} />
      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-white p-4">
          <p className="text-xs text-ink-500">Số cặp có thể kết nối</p>
          <p className="mt-1 font-mono text-2xl font-semibold tabular-nums text-ink-900">{num(pairs)}</p>
        </div>
        <div className="rounded-xl bg-white p-4">
          <p className="text-xs text-ink-500">Khả năng có 2 người trùng sinh nhật</p>
          <p className="mt-1 font-mono text-2xl font-semibold tabular-nums text-accent-700">{pct(p, 1)}</p>
        </div>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-ink-200">
        <div className="h-full rounded-full bg-accent-500 transition-all" style={{ width: `${p * 100}%` }} />
      </div>
    </Frame>
  );
}

// Illustrative solo seller: 10 working hours, each channel costs 1 hour/day to keep alive, each order 9 minutes.
const HOURS = 10;
const UPKEEP = 1;
const PER_ORDER = 0.15;
const CHANNEL_DEMAND = [30, 15, 12, 9, 7, 5];
const CHANNEL_NAMES = ["Facebook", "Zalo", "Shopee", "TikTok Shop", "Website", "Lazada"];

export function braessOrders(channels: number) {
  const demand = CHANNEL_DEMAND.slice(0, channels).reduce((a, b) => a + b, 0);
  const capacity = Math.max(0, (HOURS - UPKEEP * channels) / PER_ORDER);
  return { demand, served: Math.floor(Math.min(demand, capacity)) };
}

function BraessWidget() {
  const [k, setK] = useState(4);
  const rows = CHANNEL_DEMAND.map((_, i) => braessOrders(i + 1));
  const best = rows.reduce((b, r, i) => (r.served > rows[b].served ? i : b), 0);
  const max = Math.max(...rows.map((r) => r.demand));
  const cur = rows[k - 1];
  return (
    <Frame
      title="Mở thêm bao nhiêu kênh?"
      note={`Mô hình minh họa cho người bán một mình: 10 giờ làm mỗi ngày, mỗi kênh tốn ${UPKEEP} giờ để duy trì (đăng bài, trả lời, cập nhật kho), mỗi đơn tốn 9 phút.`}
    >
      <Slider
        label="Số kênh bán"
        value={k}
        min={1}
        max={6}
        onChange={setK}
        format={(v) => `${v} kênh`}
        hint={CHANNEL_NAMES.slice(0, k).join(" + ")}
      />
      <div className="mt-5 flex items-end gap-2">
        {rows.map((r, i) => (
          <div key={i} className="flex flex-1 flex-col items-center gap-1">
            <div className="relative h-28 w-full">
              <div className="absolute bottom-0 w-full rounded-t-md bg-ink-200" style={{ height: `${(r.demand / max) * 100}%` }} />
              <div
                className={`absolute bottom-0 w-full rounded-t-md transition-all ${i === k - 1 ? "bg-accent-600" : i === best ? "bg-emerald-500" : "bg-ink-400"}`}
                style={{ height: `${(r.served / max) * 100}%` }}
              />
            </div>
            <span className="whitespace-nowrap font-mono text-[10px] tabular-nums text-ink-600">{i + 1} kênh</span>
          </div>
        ))}
      </div>
      <p className="mt-4 text-sm leading-relaxed text-ink-700">
        Khách muốn mua: <b>{cur.demand} đơn</b>. Bạn làm kịp: <b>{cur.served} đơn</b>.{" "}
        {k - 1 > best ? (
          <span className="text-red-600">
            Ít hơn {rows[best].served - cur.served} đơn so với chỉ chạy {best + 1} kênh, dù mệt hơn.
          </span>
        ) : k - 1 === best ? (
          <span className="text-emerald-700">Đây là điểm ngọt: thêm kênh nữa sẽ bắt đầu mất đơn.</span>
        ) : (
          <span>Vẫn còn sức cho thêm kênh.</span>
        )}
      </p>
      <p className="mt-1 text-xs text-ink-500">Cột xám nhạt: khách muốn mua. Cột đậm: đơn bạn kịp làm.</p>
    </Frame>
  );
}

function MontyWidget() {
  const [result, setResult] = useState<{ stay: number; swap: number; games: number } | null>(null);
  const play = () => {
    const games = 1000;
    let stay = 0;
    for (let g = 0; g < games; g++) {
      const prize = Math.floor(Math.random() * 3);
      const pick = Math.floor(Math.random() * 3);
      // Host opens an empty door you did not pick, so switching wins exactly when the first pick was wrong.
      if (pick === prize) stay++;
    }
    setResult({ stay, swap: games - stay, games });
  };
  return (
    <Frame title="Chơi 1.000 ván, giữ và đổi">
      <button
        type="button"
        onClick={play}
        className="rounded-xl bg-ink-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-ink-800"
      >
        {result ? "Chơi lại 1.000 ván" : "Chơi 1.000 ván"}
      </button>
      {result && (
        <div className="mt-5 space-y-3">
          {[
            { label: "Luôn giữ lựa chọn cũ", wins: result.stay, color: "bg-ink-400" },
            { label: "Luôn đổi khi có tin mới", wins: result.swap, color: "bg-accent-600" },
          ].map((r) => (
            <div key={r.label}>
              <div className="flex justify-between text-sm">
                <span className="text-ink-700">{r.label}</span>
                <span className="font-mono tabular-nums text-ink-900">
                  thắng {num(r.wins)} ván ({pct(r.wins / result.games, 0)})
                </span>
              </div>
              <div className="mt-1 h-2 overflow-hidden rounded-full bg-ink-200">
                <div className={`h-full rounded-full ${r.color}`} style={{ width: `${(r.wins / result.games) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </Frame>
  );
}

const WASON_CARDS = [
  { id: "hoc", face: "Có đi học", side: "Mặt sau: doanh số?", key: true },
  { id: "khong-hoc", face: "Không đi học", side: "Mặt sau: doanh số?", key: false },
  { id: "tang", face: "Doanh số tăng", side: "Mặt sau: có đi học?", key: false },
  { id: "khong-tang", face: "Doanh số không tăng", side: "Mặt sau: có đi học?", key: true },
];

function WasonWidget() {
  const [picked, setPicked] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  const toggle = (id: string) => {
    setChecked(false);
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  };
  const correct = WASON_CARDS.every((c) => c.key === picked.includes(c.id));
  return (
    <Frame title="Bạn sẽ lật những hồ sơ nào?">
      <p className="text-sm leading-relaxed text-ink-700">
        Mỗi thẻ là hồ sơ một nhân viên: một mặt ghi có đi khóa học hay không, mặt kia ghi doanh số có tăng hay không. Bạn muốn kiểm tra câu:{" "}
        <b>“Nếu đi học thì doanh số tăng.”</b> Chọn <b>ít thẻ nhất</b> cần lật để biết câu đó đúng hay sai.
      </p>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {WASON_CARDS.map((c) => {
          const on = picked.includes(c.id);
          const tone = checked ? (c.key ? "border-emerald-500 bg-emerald-50" : on ? "border-red-400 bg-red-50" : "border-ink-200 bg-white") : on ? "border-accent-600 bg-accent-50" : "border-ink-200 bg-white";
          return (
            <button
              key={c.id}
              type="button"
              aria-pressed={on}
              onClick={() => toggle(c.id)}
              className={`flex min-h-24 sm:aspect-[3/4] sm:max-h-40 flex-col justify-between rounded-xl border-2 p-3 text-left transition ${tone}`}
            >
              <span className="text-sm font-semibold leading-snug text-ink-900">{c.face}</span>
              <span className="text-[11px] text-ink-500">{c.side}</span>
            </button>
          );
        })}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled={!picked.length}
          onClick={() => setChecked(true)}
          className="rounded-xl bg-ink-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-ink-800 disabled:opacity-40"
        >
          Kiểm tra
        </button>
        {checked && (
          <span className={`text-sm font-semibold ${correct ? "text-emerald-700" : "text-red-600"}`}>
            {correct ? "Chính xác. Bạn thuộc nhóm số ít." : "Chưa đúng. Đây là lỗi mà 9 trên 10 người mắc."}
          </span>
        )}
      </div>
      {checked && (
        <p className="mt-3 text-sm leading-relaxed text-ink-700">
          Chỉ cần lật <b>“Có đi học”</b> (xem doanh số có thật sự tăng) và <b>“Doanh số không tăng”</b> (xem người đó có đi học không, nếu có
          thì câu kia sai). Lật “Doanh số tăng” không chứng minh được gì: doanh số có thể tăng vì lý do khác. Đó chính là cái bẫy chỉ đi tìm bằng
          chứng xác nhận.
        </p>
      )}
    </Frame>
  );
}

type HotelMode = "full" | "one" | "many";

function HilbertWidget() {
  const [mode, setMode] = useState<HotelMode>("full");
  const rooms = Array.from({ length: 12 }, (_, i) => i + 1);
  const occupant = (room: number): { label: string; fresh: boolean } => {
    if (mode === "full") return { label: `K${room}`, fresh: false };
    if (mode === "one") return room === 1 ? { label: "Mới", fresh: true } : { label: `K${room - 1}`, fresh: false };
    return room % 2 === 0 ? { label: `K${room / 2}`, fresh: false } : { label: `M${(room + 1) / 2}`, fresh: true };
  };
  const steps: Record<HotelMode, string> = {
    full: "Khách sạn kín: phòng n có khách Kn. Cứ thế tới vô cùng.",
    one: "Luật dời chỗ: khách phòng n sang phòng n+1. Phòng 1 trống cho khách mới.",
    many: "Luật dời chỗ: khách phòng n sang phòng 2n. Mọi phòng lẻ trống cho cả đoàn M1, M2, M3…",
  };
  return (
    <Frame title="Bấm để thấy khách sạn tự dời chỗ">
      <div className="flex flex-wrap gap-2">
        {(
          [
            ["full", "Đang kín phòng"],
            ["one", "1 khách mới tới"],
            ["many", "Cả đoàn vô hạn tới"],
          ] as [HotelMode, string][]
        ).map(([m, label]) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${mode === m ? "bg-ink-900 text-white" : "bg-white text-ink-700 hover:bg-ink-100"}`}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-6 gap-2 sm:grid-cols-12">
        {rooms.map((r) => {
          const o = occupant(r);
          return (
            <div
              key={`${mode}-${r}`}
              className={`animate-rise rounded-lg border p-2 text-center ${o.fresh ? "border-accent-500 bg-accent-50" : "border-ink-200 bg-white"}`}
              style={{ animationDelay: `${r * 30}ms` }}
            >
              <p className="font-mono text-[10px] text-ink-400">P{r}</p>
              <p className={`text-xs font-semibold ${o.fresh ? "text-accent-700" : "text-ink-800"}`}>{o.label}</p>
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-sm text-ink-700">{steps[mode]}</p>
    </Frame>
  );
}

function ZenoWidget() {
  const [lead, setLead] = useState(12);
  const [mine, setMine] = useState(1.5);
  const theirs = 1;
  const gap = mine - theirs;
  const months = gap > 0 ? lead / gap : Infinity;
  // Zeno's view: each round you reach where they were, while they move on.
  const rounds: number[] = [];
  if (gap > 0) {
    let remaining = lead;
    for (let i = 0; i < 5 && remaining > 0.05; i++) {
      rounds.push(remaining / mine);
      remaining = (remaining / mine) * theirs;
    }
  }
  return (
    <Frame
      title="Bao lâu bạn bắt kịp người dẫn đầu?"
      note="Tốc độ đối thủ được tính là 1. Tốc độ của bạn 1,5 nghĩa là trong cùng thời gian bạn làm được gấp rưỡi họ."
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Slider label="Đối thủ dẫn trước" value={lead} min={3} max={36} onChange={setLead} format={(v) => `${v} tháng`} />
        <Slider
          label="Tốc độ của bạn so với đối thủ"
          value={mine}
          min={0.8}
          max={3}
          step={0.1}
          onChange={setMine}
          format={(v) => `${v.toFixed(1).replace(".", ",")} lần`}
        />
      </div>
      <div className="mt-5 rounded-xl bg-white p-4">
        {gap > 0 ? (
          <>
            <p className="text-xs text-ink-500">Bạn bắt kịp sau</p>
            <p className="mt-1 font-mono text-2xl font-semibold tabular-nums text-accent-700">{num(Math.round(months * 10) / 10)} tháng</p>
            <p className="mt-3 text-xs leading-relaxed text-ink-500">
              Nếu chỉ chạy tới chỗ họ vừa đứng, mỗi vòng mất:{" "}
              {rounds.map((r) => `${num(Math.round(r * 10) / 10)}`).join(" → ")} tháng… Vô số vòng, nhưng cộng lại vẫn là{" "}
              {num(Math.round(months * 10) / 10)} tháng.
            </p>
          </>
        ) : (
          <>
            <p className="text-xs text-ink-500">Bạn bắt kịp sau</p>
            <p className="mt-1 text-2xl font-semibold text-red-600">Không bao giờ</p>
            <p className="mt-3 text-xs leading-relaxed text-ink-500">
              Tốc độ không hơn đối thủ thì chăm chỉ đến đâu khoảng cách cũng không hẹp lại. Cần đổi đường, không phải cố thêm.
            </p>
          </>
        )}
      </div>
    </Frame>
  );
}

export function ParadoxWidget({ id }: { id: WidgetId }) {
  switch (id) {
    case "birthday":
      return <BirthdayWidget />;
    case "braess":
      return <BraessWidget />;
    case "monty":
      return <MontyWidget />;
    case "wason":
      return <WasonWidget />;
    case "hilbert":
      return <HilbertWidget />;
    case "zeno":
      return <ZenoWidget />;
  }
}
