import { useReveal } from '../../hooks/useReveal';

const features = [
  {
    icon: 'architecture',
    bg: 'bg-secondary-container',
    fg: 'text-on-secondary-container',
    title: '정교한 평면 분석',
    desc: '제공해주신 평면도의 치수를 AI가 정확히 인식하여 실제 가구 배치와 공간감을 구현합니다.',
  },
  {
    icon: 'palette',
    bg: 'bg-tertiary-fixed',
    fg: 'text-on-tertiary-fixed-variant',
    title: '자재 질감 구현',
    desc: '마루, 타일, 벽지 등 실제 유통되는 고품질 자재의 질감을 빛의 각도에 맞춰 생생하게 시뮬레이션합니다.',
  },
  {
    icon: 'engineering',
    bg: 'bg-primary-fixed',
    fg: 'text-on-primary-fixed-variant',
    title: '시공 전문가 검토',
    desc: 'AI 결과물을 시공 팀이 직접 검토하여 현실적으로 구현 불가능한 디자인을 사전에 걸러냅니다.',
  },
];

export default function ServiceSection() {
  const ref = useReveal<HTMLElement>();

  return (
    <section
      ref={ref}
      className="reveal border-y border-outline/10 bg-surface-container px-5 py-20 md:px-16 md:py-24"
    >
      <div className="mx-auto mb-12 max-w-[1280px] text-center">
        <h3 className="mb-3 font-display text-2xl font-semibold tracking-[-0.01em] text-primary md:text-[32px] md:leading-[1.3]">
          불확실성을 확신으로 바꿉니다
        </h3>
        <p className="mx-auto max-w-2xl text-sm leading-relaxed text-on-surface-variant md:text-base">
          이레플랜 AI는 단순한 이미지가 아닌, 시공 가능 여부(Feasibility)가
          검증된 고해상도 디자인 프리뷰를 제공합니다.
        </p>
      </div>

      <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
        {features.map((f) => (
          <div
            key={f.icon}
            className="glass-panel rounded-2xl border border-outline-variant/30 p-7 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl md:p-8"
          >
            <div
              className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl ${f.bg}`}
            >
              <span className={`material-symbols-outlined ${f.fg}`}>
                {f.icon}
              </span>
            </div>
            <h4 className="mb-3 font-display text-lg font-semibold text-primary">
              {f.title}
            </h4>
            <p className="text-sm leading-relaxed text-on-surface-variant">
              {f.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
