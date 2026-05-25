type CardProps = {
  label: string;
  caption: string;
  children: React.ReactNode;
  accent?: boolean;
};

function Card({ label, caption, children, accent }: CardProps) {
  return (
    <div className="flex flex-col">
      <div
        className={
          'relative aspect-[4/3] overflow-hidden rounded-2xl ' +
          (accent
            ? 'ring-2 ring-stone-900'
            : 'border border-stone-200 bg-stone-100')
        }
      >
        {children}
        <span
          className={
            'absolute left-3 top-3 rounded-md px-2.5 py-1 text-xs font-semibold ' +
            (accent
              ? 'bg-stone-900 text-white'
              : 'bg-white/95 text-stone-700 ring-1 ring-stone-200')
          }
        >
          {label}
        </span>
      </div>
      <p className="mt-3 text-sm text-stone-600 md:text-base">{caption}</p>
    </div>
  );
}

function PlaceholderBox({ text }: { text: string }) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-stone-100 to-stone-200">
      <span className="text-sm font-medium text-stone-400">{text}</span>
    </div>
  );
}

export default function BeforeAiAfterSection() {
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <div className="mb-12 text-center md:mb-16">
          <p className="mb-3 text-sm font-medium tracking-wide text-amber-700 md:text-base">
            상상에서 끝나지 않습니다
          </p>
          <h2 className="font-bold leading-tight tracking-tight text-3xl text-stone-900 md:text-5xl">
            상상 이미지에서 끝나지 않습니다.
            <br />
            <span className="text-stone-600">
              이레플랜은 AI 디자인을 실제 시공 결과로 연결합니다.
            </span>
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3 md:gap-8">
          <Card label="Before" caption="기존 공간 사진">
            <PlaceholderBox text="기존 공간" />
          </Card>

          <Card label="AI Preview" caption="이레플랜이 제작한 AI 미리보기" accent>
            <img
              src="/demo-render.png"
              alt="AI 리모델링 미리보기 샘플"
              className="h-full w-full object-cover"
            />
          </Card>

          <Card label="After" caption="실제 시공 완료 이미지">
            <PlaceholderBox text="시공 완료" />
          </Card>
        </div>
      </div>
    </section>
  );
}
