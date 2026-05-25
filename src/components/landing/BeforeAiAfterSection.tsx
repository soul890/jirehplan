import { useRef } from 'react';
import { useReveal } from '../../hooks/useReveal';

type Card = {
  beforeLabel: string;
  beforeText: string;
  afterLabel: string;
  afterText: string;
  description: string;
  image: string;
};

const cards: Card[] = [
  {
    beforeLabel: 'BEFORE',
    beforeText: '정밀 평면도 분석',
    afterLabel: 'AI SCAN',
    afterText: '공간 최적화 시뮬레이션',
    description:
      '제공된 평면도를 바탕으로 실제 치수와 구조를 AI가 정밀 분석하여 리모델링 가능 범위를 도출합니다.',
    image: '/demo-render.png',
  },
  {
    beforeLabel: 'BEFORE',
    beforeText: '구식 거실 구조',
    afterLabel: 'AI PREVIEW',
    afterText: '모던 미니멀 거실',
    description:
      '동선을 재설계하고 마감재를 교체하여 깔끔한 미니멀 거실로 재구성한 AI 시뮬레이션입니다.',
    image: '/demo-render.png',
  },
];

export default function BeforeAiAfterSection() {
  const ref = useReveal<HTMLElement>();
  const scrollerRef = useRef<HTMLDivElement>(null);

  function scrollBy(dir: 1 | -1) {
    const el = scrollerRef.current;
    if (!el) return;
    const cardWidth = el.querySelector('div')?.clientWidth ?? 400;
    el.scrollBy({ left: (cardWidth + 24) * dir, behavior: 'smooth' });
  }

  return (
    <section
      ref={ref}
      className="reveal overflow-hidden px-5 py-20 md:px-16 md:py-24"
    >
      <div className="mx-auto max-w-[1280px]">
        <div className="mb-10 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <span className="font-display text-[11px] font-bold uppercase tracking-[0.05em] text-on-tertiary-container md:text-[12px]">
              Vision to Reality
            </span>
            <h3 className="mt-2 font-display text-2xl font-semibold tracking-[-0.01em] text-primary md:text-[32px]">
              Before & After 미리보기
            </h3>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => scrollBy(-1)}
              aria-label="이전"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-outline/30 transition-colors hover:bg-surface-container active:scale-90"
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button
              onClick={() => scrollBy(1)}
              aria-label="다음"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-outline/30 transition-colors hover:bg-surface-container active:scale-90"
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>

        <div
          ref={scrollerRef}
          className="custom-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto pb-6"
        >
          {cards.map((c, i) => (
            <div
              key={i}
              className="group min-w-[320px] flex-shrink-0 cursor-pointer snap-start md:min-w-[460px]"
            >
              <div className="relative h-[500px] overflow-hidden rounded-2xl border border-outline/10 shadow-lg transition-transform duration-500 group-hover:scale-[1.02]">
                <img
                  src={c.image}
                  alt=""
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="ai-scanner-line opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                {i === 0 && (
                  <div className="absolute top-4 right-4 rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-[0.05em] text-on-primary">
                    AI Preview Active
                  </div>
                )}

                <div className="absolute right-6 bottom-6 left-6 space-y-3">
                  <div className="flex items-center justify-between text-white">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold uppercase tracking-[0.05em] text-white/60">
                        {c.beforeLabel}
                      </span>
                      <span className="text-base font-semibold">
                        {c.beforeText}
                      </span>
                    </div>
                    <span className="material-symbols-outlined">sync_alt</span>
                    <div className="flex flex-col text-right">
                      <span className="text-[10px] font-bold uppercase tracking-[0.05em] text-tertiary-fixed">
                        {c.afterLabel}
                      </span>
                      <span className="text-base font-semibold">
                        {c.afterText}
                      </span>
                    </div>
                  </div>
                  <p className="text-[13px] leading-relaxed text-white/80">
                    {c.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
