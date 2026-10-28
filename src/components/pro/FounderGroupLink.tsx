"use client";

import { usePro } from "./ProProvider";

/** Join button for the founder Zalo group, shown only once a founder license is active. */
export function FounderGroupLink() {
  const { founderGroup } = usePro();
  if (!founderGroup) return null;
  return (
    <div className="mx-auto mt-6 max-w-sm rounded-xl border border-accent-200 bg-accent-50 p-4 text-center">
      <p className="text-sm font-semibold text-ink-900">Chào mừng thành viên Sáng lập!</p>
      <p className="mt-1 text-xs leading-relaxed text-ink-600">
        Vào nhóm Zalo riêng để nhận lịch 1:1 hằng tháng và gặp các thành viên sáng lập khác.
      </p>
      <a
        href={founderGroup}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-block rounded-xl bg-accent-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-700"
      >
        Vào nhóm Zalo Sáng lập
      </a>
    </div>
  );
}
