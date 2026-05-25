export default function DisclaimerFooter() {
  return (
    <footer className="border-t border-stone-200 bg-stone-50 pb-24 pt-12 md:pb-12">
      <div className="mx-auto max-w-3xl px-6 md:px-8">
        <div className="rounded-xl border border-stone-200 bg-white p-5 md:p-6">
          <p className="text-xs leading-relaxed text-stone-500 md:text-sm">
            AI 미리보기 이미지는 디자인 방향 제안용입니다.
            <br />
            실제 시공 결과는 현장 조건, 기존 구조, 자재 수급, 예산에 따라 달라질
            수 있습니다.
          </p>
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-2 text-xs text-stone-400 md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} (주)이레플랜. All rights reserved.</p>
          <p>이레플랜 AI 리모델링 · 상담 신청 페이지</p>
        </div>
      </div>
    </footer>
  );
}
