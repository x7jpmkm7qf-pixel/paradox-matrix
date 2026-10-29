"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { TRACKS, type Paradox, type Quiz } from "./content";
import { ParadoxWidget } from "./Widgets";

export function Engine() {
  const [active, setActive] = useState(TRACKS[0].id);

  // Deep links: /ung-dung#van-hanh opens that tab, a paradox id opens its tab and scrolls to it.
  useEffect(() => {
    const open = () => {
      const hash = window.location.hash.slice(1);
      if (!hash) return;
      const track = TRACKS.find((t) => t.id === hash || t.paradoxes.some((p) => p.id === hash));
      if (!track) return;
      setActive(track.id);
      requestAnimationFrame(() => document.getElementById(hash === track.id ? "dong-co" : hash)?.scrollIntoView());
    };
    open();
    window.addEventListener("hashchange", open);
    return () => window.removeEventListener("hashchange", open);
  }, []);

  const select = (id: string) => {
    setActive(id);
    history.replaceState(null, "", `#${id}`);
  };

  const track = TRACKS.find((t) => t.id === active)!;

  return (
    <div id="dong-co" className="scroll-mt-14">
      <div className="sticky top-14 z-20 border-b border-ink-200 bg-white/95 backdrop-blur">
        <div role="tablist" aria-label="Chọn tầng phù hợp với bạn" className="mx-auto grid max-w-6xl grid-cols-3 gap-1 px-2 py-2 sm:gap-2 sm:px-6">
          {TRACKS.map((t) => {
            const on = t.id === active;
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={on}
                aria-controls={`panel-${t.id}`}
                onClick={() => select(t.id)}
                className={`rounded-xl px-2 py-2 text-left transition sm:px-4 sm:py-3 ${on ? "bg-ink-900 text-white" : "text-ink-600 hover:bg-ink-100"}`}
              >
                <span className={`block font-mono text-[10px] sm:text-xs ${on ? "text-flame-400" : "text-accent-600"}`}>{t.tag}</span>
                <span className="mt-0.5 block text-xs font-semibold leading-tight sm:text-sm">{t.short}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div id={`panel-${track.id}`} role="tabpanel" className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <div key={track.id} className="animate-rise">
          <p className="font-mono text-xs text-accent-600">{track.tag}</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink-900 sm:text-3xl">{track.label}</h2>
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-ink-600">{track.focus}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {track.audience.map((a) => (
              <span key={a} className="rounded-full border border-ink-200 bg-white px-3 py-1 text-xs text-ink-600">
                {a}
              </span>
            ))}
          </div>

          <nav className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm">
            {track.paradoxes.map((p, i) => (
              <a key={p.id} href={`#${p.id}`} className="font-semibold text-ink-900 underline decoration-ink-300 underline-offset-4 hover:decoration-ink-900">
                {i + 1}. {p.name}
              </a>
            ))}
          </nav>

          <div className="mt-8 space-y-8">
            {track.paradoxes.map((p, i) => (
              <ParadoxCard key={p.id} paradox={p} index={i + 1} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ParadoxCard({ paradox: p, index }: { paradox: Paradox; index: number }) {
  return (
    <article id={p.id} className="scroll-mt-36 overflow-hidden rounded-3xl border border-ink-200 bg-white shadow-card">
      <header className="border-b border-ink-100 p-5 sm:p-8">
        <span className="inline-block rounded-full bg-accent-50 px-3 py-1 font-mono text-[11px] text-accent-700">
          Nghịch lý {index} · {p.name}
        </span>
        <h3 className="mt-3 text-xl font-semibold leading-snug tracking-tight text-ink-900 sm:text-2xl">{p.title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-ink-600 sm:text-base">{p.hook}</p>
      </header>

      <div className="grid gap-5 p-5 sm:p-8 lg:grid-cols-[1fr_1fr]">
        <div className="space-y-5">
          {p.quiz && <QuizBox quiz={p.quiz} />}
          <ParadoxWidget id={p.widget} />
          {p.tool && (
            <Link href={p.tool.href} className="inline-block text-sm font-semibold text-ink-900 underline underline-offset-2">
              {p.tool.label} →
            </Link>
          )}
        </div>

        <div className="space-y-4">
          <section className="rounded-2xl border border-ink-200 p-5">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-ink-500">① Tình huống thực chiến</h4>
            <p className="mt-2 text-sm font-semibold text-ink-900">{p.caseStudy.who}</p>
            <p className="mt-2 text-sm leading-relaxed text-ink-700">{p.caseStudy.story}</p>
          </section>

          <section className="rounded-2xl border border-red-200 bg-red-50/60 p-5">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-red-700">② Trực giác dễ sai ở đâu</h4>
            <p className="mt-2 text-sm font-semibold italic text-ink-900">{p.wrongThinking.quote}</p>
            <p className="mt-2 text-sm leading-relaxed text-ink-700">{p.wrongThinking.why}</p>
          </section>

          <section className="rounded-2xl bg-night-900 p-5 text-white">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-flame-400">③ Bài học áp dụng ngay</h4>
            <p className="mt-2 text-base font-semibold leading-snug">{p.solution.lesson}</p>
            <ul className="mt-4 space-y-2.5">
              {p.solution.actions.map((a) => (
                <li key={a} className="flex gap-2.5 text-sm leading-relaxed text-ink-200">
                  <span aria-hidden className="mt-0.5 text-flame-400">✓</span>
                  {a}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </article>
  );
}

function QuizBox({ quiz }: { quiz: Quiz }) {
  const [choice, setChoice] = useState<number | null>(null);
  return (
    <div className="rounded-2xl border border-accent-200 bg-accent-50/60 p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-accent-700">Đoán trước khi đọc</p>
      <p className="mt-2 text-sm font-semibold leading-snug text-ink-900">{quiz.question}</p>
      <div className="mt-3 grid gap-2">
        {quiz.options.map((o, i) => {
          const tone =
            choice === null
              ? "border-ink-200 bg-white hover:border-ink-900"
              : i === quiz.answer
                ? "border-emerald-500 bg-emerald-50 text-emerald-900"
                : i === choice
                  ? "border-red-300 bg-red-50 text-red-800"
                  : "border-ink-200 bg-white opacity-60";
          return (
            <button
              key={o}
              type="button"
              onClick={() => setChoice(i)}
              className={`rounded-xl border px-4 py-2.5 text-left text-sm transition ${tone}`}
            >
              {o}
            </button>
          );
        })}
      </div>
      {choice !== null && (
        <p className="mt-3 text-sm leading-relaxed text-ink-700">
          <b className={choice === quiz.answer ? "text-emerald-700" : "text-red-600"}>
            {choice === quiz.answer ? "Đúng. " : "Trực giác vừa đánh lừa bạn. "}
          </b>
          {quiz.reveal}
        </p>
      )}
    </div>
  );
}
