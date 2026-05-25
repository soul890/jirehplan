import { useReveal } from '../../hooks/useReveal';

export default function HeroSection() {
  const ref = useReveal<HTMLElement>();

  return (
    <section
      ref={ref}
      id="hero"
      className="reveal relative overflow-hidden px-5 pt-28 pb-16 md:px-16 md:pt-36 md:pb-24"
    >
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* 텍스트 */}
        <div className="z-10 order-2 lg:order-1">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-secondary-container px-3 py-1.5">
            <span
              className="material-symbols-outlined text-[16px] text-on-secondary-container"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              auto_awesome
            </span>
            <span className="font-display text-[11px] font-bold uppercase tracking-[0.05em] text-on-secondary-container md:text-[12px]">
              Precision AI Remodeling
            </span>
          </div>

          <h2 className="mb-6 font-display text-[2rem] font-bold leading-[1.15] tracking-[-0.02em] text-primary md:text-5xl lg:text-[3.5rem] lg:leading-[1.1]">
            공사 전에
            <br />
            <span className="text-on-tertiary-container">우리 집</span>을
            <br className="md:hidden" />
            {' '}먼저 확인하세요.
          </h2>

          <p className="mb-10 max-w-xl text-base leading-[1.7] text-on-surface-variant md:text-lg md:leading-[1.7]">
            사진이나 평면도를 보내주시면 이레플랜이 AI 미리보기 이미지를 제작하고
            <span className="text-primary"> 실제 시공 가능한 방향</span>으로
            상담해드립니다.
          </p>

          <div className="mb-5 flex flex-col gap-3 sm:flex-row">
            <a
              href="#request-form"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-7 py-4 text-center text-base font-bold text-on-primary shadow-lg shadow-primary/10 transition hover:scale-[1.02] hover:bg-primary-container active:scale-95 md:text-lg"
            >
              무료 AI 미리보기 신청하기
              <span className="material-symbols-outlined">arrow_forward</span>
            </a>
          </div>

          <div className="flex items-center gap-2 text-on-surface-variant/80">
            <span className="material-symbols-outlined text-[18px]">
              verified_user
            </span>
            <span className="text-[13px] md:text-sm">
              AI 자동 즉시 생성이 아닌, 전문가 검토 후 제작됩니다.
            </span>
          </div>
        </div>

        {/* 이미지 */}
        <div className="group relative order-1 lg:order-2">
          <div className="absolute -inset-4 rounded-full bg-tertiary-fixed-dim/20 blur-3xl" />
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/20 shadow-2xl md:aspect-square">
            <img
              src="/demo-render.png"
              alt="이레플랜 AI 리모델링 미리보기 샘플"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="ai-scanner-line" />

            <div className="float-animation glass-panel absolute right-4 bottom-4 left-4 flex items-center gap-3 rounded-xl p-3 md:right-6 md:bottom-6 md:left-6 md:gap-4 md:p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-on-primary md:h-12 md:w-12">
                <span className="material-symbols-outlined text-[20px] md:text-[24px]">
                  auto_awesome
                </span>
              </div>
              <div className="min-w-0">
                <p className="font-display text-[10px] font-bold uppercase tracking-[0.05em] text-primary md:text-[11px]">
                  AI Feasibility Scan
                </p>
                <p className="truncate text-[13px] text-on-surface-variant md:text-sm">
                  구조 분석 및 자재 매칭 진행 중…
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
