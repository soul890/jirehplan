import type { RequestStatus } from '../../types/request';

const styles: Record<RequestStatus, string> = {
  '접수 완료': 'bg-blue-50 text-blue-700 ring-blue-200',
  'AI 이미지 제작 중': 'bg-amber-50 text-amber-700 ring-amber-200',
  '결과 전달 완료': 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  '견적 상담 예정': 'bg-violet-50 text-violet-700 ring-violet-200',
  '계약 완료': 'bg-stone-900 text-white ring-stone-900',
  '보류': 'bg-stone-100 text-stone-600 ring-stone-300',
};

export default function StatusBadge({ status }: { status: RequestStatus }) {
  return (
    <span
      className={
        'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ' +
        styles[status]
      }
    >
      {status}
    </span>
  );
}
