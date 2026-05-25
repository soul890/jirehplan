const steps = [
  {
    n: '01',
    title: '사진·평면도 업로드',
    desc: '스마트폰으로 찍은 공간 사진이나 네이버 부동산에서 캡쳐한 평면도를 올려주세요.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 7.5m0 0L7.5 12M12 7.5v9" />
      </svg>
    ),
  },
  {
    n: '02',
    title: '스타일과 예산 선택',
    desc: '원하는 분위기와 가능한 예산 범위를 알려주세요. 잘 모르셔도 괜찮습니다.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 0 1 0-.255c.007-.378-.138-.75-.43-.991l-1.004-.828a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      </svg>
    ),
  },
  {
    n: '03',
    title: '이레플랜이 AI 미리보기 제작',
    desc: '전문가가 직접 공간을 검토하고, 실제 시공 가능한 방향으로 AI 이미지를 제작합니다.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
      </svg>
    ),
  },
  {
    n: '04',
    title: '결과 안내 + 시공 상담',
    desc: '결과 이미지를 카카오톡/문자로 전달드리고, 예산과 일정에 맞춰 상담해드립니다.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
      </svg>
    ),
  },
];

export default function HowItWorksSection() {
  return (
    <section className="bg-stone-50 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <div className="mb-12 md:mb-16">
          <p className="mb-3 text-sm font-medium tracking-wide text-amber-700 md:text-base">
            진행 방식
          </p>
          <h2 className="font-bold leading-tight tracking-tight text-3xl text-stone-900 md:text-5xl">
            네 단계로 끝납니다.
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-4">
          {steps.map((s) => (
            <div
              key={s.n}
              className="flex flex-col rounded-2xl border border-stone-200 bg-white p-6 transition hover:shadow-lg hover:shadow-stone-900/5 md:p-7"
            >
              <div className="mb-5 flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-stone-100 text-stone-700">
                  {s.icon}
                </div>
                <span className="font-mono text-sm font-medium text-stone-400">
                  {s.n}
                </span>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-stone-900">
                {s.title}
              </h3>
              <p className="text-sm leading-relaxed text-stone-600">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
