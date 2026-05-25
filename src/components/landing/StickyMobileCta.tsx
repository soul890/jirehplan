import { useStickyAfter } from '../../hooks/useReveal';

export default function StickyMobileCta() {
  const ref = useStickyAfter('hero', 200);

  return (
    <div
      ref={ref}
      className="sticky-cta fixed inset-x-0 bottom-0 z-50 flex gap-3 border-t border-outline/10 bg-surface/90 px-4 py-3 shadow-lg backdrop-blur-xl md:hidden"
    >
      <a
        href="#request-form"
        className="flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-on-primary shadow-lg active:scale-95"
      >
        <span
          className="material-symbols-outlined text-[20px]"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          auto_awesome
        </span>
        <span className="text-sm font-bold">무료 AI 미리보기 신청하기</span>
      </a>
    </div>
  );
}
