export default function ServiceSection() {
  return (
    <section className="bg-stone-50 py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-6 md:px-8">
        <p className="mb-3 text-sm font-medium tracking-wide text-amber-700 md:text-base">
          왜 이레플랜인가요
        </p>

        <h2 className="font-bold leading-tight tracking-tight text-3xl text-stone-900 md:text-5xl">
          공사 전 가장 불안한 건
          <br />
          “완성 후 모습이 어떨까?”입니다.
        </h2>

        <div className="mt-10 space-y-5 text-base leading-relaxed text-stone-600 md:text-lg">
          <p>
            이레플랜은 고객님의 공간 사진과 평면도를 바탕으로{' '}
            <span className="font-semibold text-stone-900">
              AI 리모델링 미리보기
            </span>
            를 제작합니다.
          </p>
          <p>
            실제 시공 가능성과 예산을 함께 고려해 상담해드리기 때문에,
            <br className="hidden sm:block" />
            상상 속 이미지가 아닌{' '}
            <span className="font-semibold text-stone-900">
              실제 우리 집의 미래
            </span>
            를 미리 만나보실 수 있습니다.
          </p>
        </div>

        <div className="mt-12 overflow-hidden rounded-2xl border-2 border-stone-900 bg-stone-900 text-white">
          <div className="flex items-center gap-2 border-b border-white/10 px-6 py-3 md:px-8">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="h-4 w-4 text-amber-300"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
              />
            </svg>
            <p className="text-xs font-semibold tracking-wide text-amber-300 md:text-sm">
              꼭 알아주세요
            </p>
          </div>

          <div className="px-6 py-6 md:px-8 md:py-7">
            <p className="text-base font-semibold leading-relaxed text-white md:text-lg">
              AI가 자동으로{' '}
              <span className="bg-amber-300/20 px-1.5 py-0.5 text-amber-200">
                즉시 생성하는 서비스가 아닙니다.
              </span>
            </p>
            <p className="mt-3 text-sm leading-relaxed text-stone-300 md:text-base">
              이레플랜이{' '}
              <span className="text-white">사진과 예산, 현장 조건</span>을
              확인한 뒤<br className="hidden sm:block" /> 실제 시공 가능한
              방향으로 미리보기를 제작해드립니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
