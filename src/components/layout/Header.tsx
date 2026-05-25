export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-outline/10 bg-surface/80 shadow-sm backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between px-5 py-3.5 md:px-16 md:py-4">
        <div className="flex items-center gap-2">
          <span
            className="material-symbols-outlined text-primary"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            architecture
          </span>
          <h1 className="font-display text-[18px] font-bold tracking-tight text-primary md:text-[20px]">
            이레플랜 <span className="text-on-tertiary-container">AI</span>
          </h1>
        </div>
        <a
          href="#request-form"
          className="hidden items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-on-primary transition hover:bg-primary-container md:inline-flex"
        >
          무료 신청
          <span className="material-symbols-outlined text-[16px]">
            arrow_forward
          </span>
        </a>
      </div>
    </header>
  );
}
