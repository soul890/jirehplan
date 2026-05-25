export default function DisclaimerFooter() {
  return (
    <footer className="border-t border-outline/10 bg-surface-container-highest px-5 py-16 pb-28 text-center md:px-16 md:py-20 md:pb-20">
      <div className="mx-auto max-w-[1280px] space-y-6">
        <div className="flex items-center justify-center gap-2">
          <span
            className="material-symbols-outlined text-primary"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            architecture
          </span>
          <h4 className="font-display text-xl font-bold tracking-tight text-primary md:text-2xl">
            이레플랜 <span className="text-on-tertiary-container">AI</span>
          </h4>
        </div>

        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          <a
            href="#"
            className="font-display text-[11px] font-bold uppercase tracking-[0.05em] text-on-surface-variant transition-all hover:text-primary"
          >
            Privacy Policy
          </a>
          <a
            href="#"
            className="font-display text-[11px] font-bold uppercase tracking-[0.05em] text-on-surface-variant transition-all hover:text-primary"
          >
            Terms of Service
          </a>
          <a
            href="#"
            className="font-display text-[11px] font-bold uppercase tracking-[0.05em] text-on-surface-variant transition-all hover:text-primary"
          >
            AI Ethics
          </a>
        </div>

        <p className="mx-auto max-w-lg text-sm leading-relaxed text-on-surface-variant opacity-80">
          이레플랜은 건축의 정밀함과 인공지능의 효율성을 결합하여 가장 정직한
          리모델링 솔루션을 제공합니다.
        </p>

        <div className="border-t border-outline/10 pt-6">
          <p className="font-display text-[10px] font-bold uppercase tracking-[0.05em] text-outline">
            © {new Date().getFullYear()} (주)이레플랜. Precision in every pixel.
          </p>
        </div>
      </div>
    </footer>
  );
}
