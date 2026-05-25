import { useReveal } from '../../hooks/useReveal';

type Step = {
  num: string;
  title: string;
  desc: string;
  variant: 'filled' | 'outline' | 'accent';
};

const steps: Step[] = [
  {
    num: '1',
    title: 'Upload',
    desc: '현재 공간의 사진이나 평면도를 업로드해주세요.',
    variant: 'filled',
  },
  {
    num: '2',
    title: 'Style / Budget',
    desc: '원하는 스타일과 예산 범위를 선택합니다.',
    variant: 'outline',
  },
  {
    num: '3',
    title: 'Expert Review',
    desc: '전문가가 구조적 특이사항을 1차 검토합니다.',
    variant: 'outline',
  },
  {
    num: '4',
    title: 'Preview & Consult',
    desc: 'AI 디자인 시안을 수령하고 상세 상담을 진행합니다.',
    variant: 'accent',
  },
];

function circleClass(variant: Step['variant']) {
  if (variant === 'filled')
    return 'bg-primary text-on-primary';
  if (variant === 'accent')
    return 'bg-tertiary text-on-tertiary';
  return 'bg-surface-container-highest text-primary border-2 border-primary';
}

export default function HowItWorksSection() {
  const ref = useReveal<HTMLElement>();

  return (
    <section
      ref={ref}
      className="reveal bg-surface-container-high px-5 py-20 md:px-16 md:py-24"
    >
      <div className="mx-auto max-w-[1280px]">
        <h3 className="mb-16 text-center font-display text-2xl font-semibold tracking-[-0.01em] text-primary md:mb-20 md:text-[32px]">
          간편한 4단계 리모델링 여정
        </h3>

        <div className="relative flex flex-col gap-12 md:flex-row md:justify-between md:gap-6">
          {/* Connector line on desktop */}
          <div className="absolute top-8 left-0 -z-0 hidden h-[2px] w-full bg-outline-variant/30 md:block" />

          {steps.map((s) => (
            <div
              key={s.num}
              className="group relative z-10 flex flex-1 flex-col items-center text-center"
            >
              <div
                className={`mb-6 flex h-16 w-16 items-center justify-center rounded-full font-display text-xl font-bold shadow-xl transition-transform duration-300 group-hover:scale-110 ${circleClass(s.variant)}`}
              >
                {s.num}
              </div>
              <h5 className="mb-2 font-display text-lg font-semibold text-primary">
                {s.title}
              </h5>
              <p className="px-4 text-[13px] leading-relaxed text-on-surface-variant md:text-sm">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
