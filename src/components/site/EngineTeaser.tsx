import Link from "next/link";
import { TRACKS } from "@/app/ung-dung/content";

/** Home page entry to "Động cơ Nghịch lý Chiến lược": one card per audience, each paradox deep-linked. */
export function EngineTeaser() {
  return (
    <section id="thuc-chien" className="relative scroll-mt-20 overflow-hidden bg-night-950 text-white">
      <div className="pm-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]" aria-hidden="true" />
      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="inline-block rounded-full bg-flame-500/15 px-3 py-1 text-xs font-semibold text-flame-300">Mới · Động cơ Nghịch lý Chiến lược</p>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
            6 điều nghe vô lý nhưng đúng. Chọn đúng vị trí của bạn, mang về việc làm được ngay.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-300 sm:text-base">
            Mỗi bài có tình huống thật, chỗ trực giác hay trượt, và danh sách việc cụ thể. Đoán thử, tự tay chạy con số, miễn phí.
          </p>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {TRACKS.map((t) => (
            <div key={t.id} className="pm-glass flex flex-col rounded-2xl p-6">
              <p className="font-mono text-xs text-flame-400">{t.tag}</p>
              <h3 className="mt-1 text-lg font-semibold">{t.label}</h3>
              <p className="mt-1 text-xs leading-relaxed text-ink-400">{t.audience.join(" · ")}</p>
              <ul className="mt-4 flex-1 space-y-2">
                {t.paradoxes.map((p) => (
                  <li key={p.id}>
                    <Link
                      href={`/ung-dung#${p.id}`}
                      className="block rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm leading-snug text-ink-100 transition hover:border-flame-400/60 hover:bg-white/10"
                    >
                      {p.title}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link href={`/ung-dung#${t.id}`} className="mt-5 text-sm font-semibold text-flame-300 hover:text-flame-400">
                Vào tầng này →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
