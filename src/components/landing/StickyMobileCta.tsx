export default function StickyMobileCta() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-stone-200 bg-white/95 px-4 py-3 backdrop-blur md:hidden">
      <a
        href="#request-form"
        className="flex w-full items-center justify-center rounded-full bg-stone-900 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-stone-900/10 active:scale-[0.98]"
      >
        무료 미리보기 신청하기
      </a>
    </div>
  );
}
