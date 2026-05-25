export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-stone-900 text-white">
      <div className="absolute inset-0 bg-gradient-to-br from-stone-900 via-stone-900 to-stone-800" />
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage:
          'radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)',
        backgroundSize: '24px 24px',
      }} />

      <div className="relative mx-auto max-w-5xl px-6 pt-20 pb-24 md:px-8 md:pt-32 md:pb-40">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium tracking-wide backdrop-blur-sm md:text-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />
          이레플랜 AI 리모델링
        </div>

        <h1 className="font-bold leading-[1.15] tracking-tight text-4xl md:text-6xl lg:text-7xl">
          우리 집 리모델링,
          <br />
          공사 전에 먼저 확인하세요.
        </h1>

        <p className="mt-8 max-w-2xl text-base leading-relaxed text-stone-300 md:text-lg">
          사진이나 평면도를 보내주시면
          <br className="hidden sm:block" />
          이레플랜이 AI 미리보기 이미지를 제작하고
          <br className="hidden sm:block" />
          <span className="text-white">실제 시공 가능한 방향</span>으로 상담해드립니다.
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <a
            href="#request-form"
            className="inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-base font-semibold text-stone-900 transition hover:bg-stone-100 active:scale-[0.98] md:text-lg"
          >
            무료 AI 미리보기 신청하기
            <svg
              className="ml-2 h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </a>
        </div>

        <p className="mt-8 text-xs text-stone-400 md:text-sm">
          · 신청 후 영업일 기준 1~2일 이내 결과 안내 · 무료
        </p>
      </div>
    </section>
  );
}
