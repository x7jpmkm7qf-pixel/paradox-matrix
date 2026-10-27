"use client";

import { useMemo, useState } from "react";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card } from "@/components/ui/Card";
import { Slider } from "@/components/ui/Slider";
import { Stat } from "@/components/ui/Stat";
import { Button } from "@/components/ui/Button";
import { axisProps, chartColors, tooltipStyle } from "@/components/ui/chartTheme";
import { simulateMontyHall } from "@/lib/montyHall";
import { newSeed } from "@/lib/random";
import { num, pct } from "@/lib/format";

export function MontyHallSimulator() {
  const [doors, setDoors] = useState(3);
  const [games, setGames] = useState(2000);
  const [seed, setSeed] = useState(7);

  const result = useMemo(() => simulateMontyHall(games, doors, seed), [games, doors, seed]);
  const stayRate = result.stayWins / result.games;
  const switchRate = result.switchWins / result.games;

  return (
    <Card
      title="Bài học thêm (không bắt buộc): dám đổi hướng khi có thông tin mới"
      subtitle="Bạn chọn 1 cửa. Người dẫn chương trình (biết đáp án) mở hết các cửa trống còn lại, chỉ chừa 1 cửa. Giữ hay đổi?"
      actions={<Button onClick={() => setSeed(newSeed())}>Chạy lại</Button>}
    >
      <div className="grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div className="space-y-5">
          <Slider
            label="Số cánh cửa (số phương án)"
            value={doors}
            min={3}
            max={20}
            onChange={setDoors}
            hint="Hãy nghĩ mỗi cửa là một chiến lược. Thị trường loại dần các phương án sai, để lại một lựa chọn khác."
          />
          <Slider label="Số lần cho máy chơi thử" value={games} min={100} max={20000} step={100} onChange={setGames} format={num} />
          <div className="grid grid-cols-2 gap-3">
            <Stat label="Giữ nguyên" value={pct(stayRate)} caption={`Lý thuyết: ${pct(1 / doors)}`} />
            <Stat label="Đổi lựa chọn" value={pct(switchRate)} caption={`Lý thuyết: ${pct(1 - 1 / doors)}`} emphasis />
          </div>
          <p className="text-sm leading-relaxed text-ink-600">
            Với {doors} cửa, đổi lựa chọn thắng gấp <b className="font-mono text-ink-900">{(doors - 1).toString()}</b> lần giữ nguyên. Lựa
            chọn ban đầu được đưa ra khi bạn biết ít nhất; thông tin mới không làm nó đúng hơn. Trong kinh doanh, &quot;trung thành&quot;
            với kế hoạch cũ chỉ vì đó là kế hoạch của mình là một cái bẫy.
          </p>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={result.series} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
              <CartesianGrid stroke={chartColors.grid} vertical={false} />
              <XAxis dataKey="games" {...axisProps} tickFormatter={(v: number) => num(v)} />
              <YAxis {...axisProps} domain={[0, 1]} tickFormatter={(v: number) => pct(v, 0)} />
              <Tooltip
                {...tooltipStyle}
                labelFormatter={(v) => `Sau ${num(Number(v))} lượt`}
                formatter={(v: number, name) => [pct(v), name === "switch" ? "Đổi" : "Giữ"]}
              />
              <Legend
                iconType="plainline"
                wrapperStyle={{ fontSize: 12 }}
                formatter={(v) => (v === "switch" ? "Tỷ lệ thắng khi đổi" : "Tỷ lệ thắng khi giữ")}
              />
              <Line type="monotone" dataKey="switch" stroke={chartColors.primary} strokeWidth={2} dot={false} isAnimationActive={false} />
              <Line type="monotone" dataKey="stay" stroke={chartColors.secondary} strokeWidth={2} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
}
