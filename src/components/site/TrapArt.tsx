// Small schematic charts that let each trap card be read at a glance.
type Kind = "report" | "sunk" | "growth";

export function TrapArt({ kind }: { kind: Kind }) {
  return (
    <svg viewBox="0 0 160 64" className="h-16 w-full" aria-hidden="true">
      {kind === "report" && <Report />}
      {kind === "sunk" && <Sunk />}
      {kind === "growth" && <Growth />}
    </svg>
  );
}

function Report() {
  // Total: A beats B. Each customer group: B beats A.
  const groups: [string, number, number][] = [
    ["Tổng", 46, 38],
    ["Nhóm 1", 30, 40],
    ["Nhóm 2", 22, 32],
  ];
  return (
    <>
      {groups.map(([label, a, b], i) => {
        const gx = 12 + i * 52;
        return (
          <g key={label}>
            <rect x={gx} y={54 - a} width="14" height={a} rx="3" fill={i ? "#bfd3fe" : "#3b6cf6"} />
            <rect x={gx + 17} y={54 - b} width="14" height={b} rx="3" fill={i ? "#ff8a1f" : "#ffc27a"} />
            <line x1={gx - 4} x2={gx + 35} y1="55" y2="55" stroke="#d9d9de" />
            <text x={gx + 15} y="63" textAnchor="middle" fontSize="7" fill="#737382">
              {label}
            </text>
          </g>
        );
      })}
    </>
  );
}

function Sunk() {
  return (
    <>
      <line x1="6" x2="154" y1="38" y2="38" stroke="#ff8a1f" strokeDasharray="3 3" />
      <path d="M8,10 C40,14 60,22 84,32 S130,50 150,54" fill="none" stroke="#3b6cf6" strokeWidth="3" strokeLinecap="round" />
      <circle cx="150" cy="54" r="5" fill="#f43f5e" />
      <text x="8" y="34" fontSize="7" fill="#f07208">
        hoà vốn
      </text>
      <text x="142" y="63" textAnchor="end" fontSize="7" fill="#e11d48">
        vẫn chạy tiếp?
      </text>
    </>
  );
}

function Growth() {
  return (
    <>
      <path d="M6,54 C60,53 92,50 112,40 S140,14 154,6" fill="none" stroke="#3b6cf6" strokeWidth="3" strokeLinecap="round" />
      <line x1="84" x2="84" y1="8" y2="56" stroke="#f43f5e" strokeDasharray="3 3" />
      <text x="80" y="14" textAnchor="end" fontSize="7" fill="#e11d48">
        bỏ cuộc ở đây
      </text>
      <circle cx="122" cy="32" r="5" fill="#ff8a1f" />
      <text x="128" y="46" fontSize="7" fill="#f07208">
        điểm bật
      </text>
    </>
  );
}
