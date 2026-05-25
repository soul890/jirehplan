import { useState, useRef } from 'react';
import {
  SPACE_TYPES,
  STYLE_TYPES,
  BUDGET_RANGES,
  type SpaceType,
  type StyleType,
  type BudgetRange,
} from '../../types/request';
import { submitRequest } from '../../lib/requests';

type FormState = {
  name: string;
  phone: string;
  region: string;
  spaceType: SpaceType | '';
  styleType: StyleType | '';
  budgetRange: BudgetRange | '';
  requestNote: string;
  consultationTime: string;
  contentAgreement: boolean;
};

const initialState: FormState = {
  name: '',
  phone: '',
  region: '',
  spaceType: '',
  styleType: '',
  budgetRange: '',
  requestNote: '',
  consultationTime: '',
  contentAgreement: false,
};

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

export default function RequestFormSection() {
  const [form, setForm] = useState<FormState>(initialState);
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const list = e.target.files;
    if (!list) return;
    const arr = Array.from(list);
    setFiles((prev) => [...prev, ...arr]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function removeFile(idx: number) {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === 'submitting') return;

    if (
      !form.name ||
      !form.phone ||
      !form.region ||
      !form.spaceType ||
      !form.styleType ||
      !form.budgetRange
    ) {
      setErrorMsg('필수 항목을 모두 입력해주세요.');
      return;
    }
    if (files.length === 0) {
      setErrorMsg('사진 또는 평면도를 한 장 이상 업로드해주세요.');
      return;
    }

    setErrorMsg('');
    setStatus('submitting');
    try {
      await submitRequest({
        name: form.name,
        phone: form.phone,
        region: form.region,
        spaceType: form.spaceType as SpaceType,
        styleType: form.styleType as StyleType,
        budgetRange: form.budgetRange as BudgetRange,
        requestNote: form.requestNote,
        consultationTime: form.consultationTime,
        contentAgreement: form.contentAgreement,
        files,
      });
      setStatus('success');
      window.scrollTo({ top: document.getElementById('request-form')?.offsetTop ?? 0, behavior: 'smooth' });
    } catch (err) {
      console.error(err);
      setErrorMsg('신청 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      setStatus('error');
    }
  }

  if (status === 'success') {
    return <CompletionView />;
  }

  return (
    <section
      id="request-form"
      className="scroll-mt-6 bg-white py-20 md:py-28"
    >
      <div className="mx-auto max-w-2xl px-6 md:px-8">
        <div className="mb-10 md:mb-12">
          <p className="mb-3 text-sm font-medium tracking-wide text-amber-700 md:text-base">
            무료 AI 미리보기 신청
          </p>
          <h2 className="font-bold leading-tight tracking-tight text-3xl text-stone-900 md:text-4xl">
            5분이면 신청 완료.
          </h2>
          <p className="mt-3 text-sm text-stone-600 md:text-base">
            신청 후 영업일 기준 1~2일 이내에 카카오톡 또는 문자로 결과를
            안내드립니다.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Field label="이름" required>
            <input
              type="text"
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              placeholder="홍길동"
              className={inputCls}
              required
            />
          </Field>

          <Field label="연락처" required hint="결과 안내를 받으실 휴대전화 번호">
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => update('phone', e.target.value)}
              placeholder="010-0000-0000"
              className={inputCls}
              required
            />
          </Field>

          <Field label="지역" required hint="시·구 단위로 적어주세요">
            <input
              type="text"
              value={form.region}
              onChange={(e) => update('region', e.target.value)}
              placeholder="예) 서울 강남구"
              className={inputCls}
              required
            />
          </Field>

          <Field label="리모델링 희망 공간" required>
            <select
              value={form.spaceType}
              onChange={(e) => update('spaceType', e.target.value as SpaceType)}
              className={inputCls}
              required
            >
              <option value="" disabled>
                선택해주세요
              </option>
              {SPACE_TYPES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </Field>

          <Field label="원하는 스타일" required>
            <select
              value={form.styleType}
              onChange={(e) => update('styleType', e.target.value as StyleType)}
              className={inputCls}
              required
            >
              <option value="" disabled>
                선택해주세요
              </option>
              {STYLE_TYPES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </Field>

          <Field label="예산 범위" required>
            <select
              value={form.budgetRange}
              onChange={(e) =>
                update('budgetRange', e.target.value as BudgetRange)
              }
              className={inputCls}
              required
            >
              <option value="" disabled>
                선택해주세요
              </option>
              {BUDGET_RANGES.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </Field>

          <Field
            label="사진 또는 평면도"
            required
            hint="여러 장 업로드 가능 (jpg, png, pdf)"
          >
            <div className="space-y-3">
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-stone-300 bg-stone-50 px-4 py-6 text-sm text-stone-600 transition hover:border-stone-400 hover:bg-stone-100">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z"
                  />
                </svg>
                파일 선택하기 또는 끌어다 놓기
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,application/pdf"
                  onChange={handleFiles}
                  className="hidden"
                />
              </label>

              {files.length > 0 && (
                <ul className="space-y-2">
                  {files.map((f, i) => (
                    <li
                      key={`${f.name}-${i}`}
                      className="flex items-center justify-between gap-3 rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm"
                    >
                      <span className="truncate text-stone-700">{f.name}</span>
                      <button
                        type="button"
                        onClick={() => removeFile(i)}
                        className="shrink-0 rounded-md px-2 py-1 text-xs text-stone-500 hover:bg-stone-100 hover:text-stone-700"
                      >
                        삭제
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Field>

          <div className="mt-10 border-t border-stone-200 pt-8">
            <p className="mb-5 text-sm font-medium text-stone-500">
              선택 입력 (안 적으셔도 괜찮습니다)
            </p>

            <div className="space-y-6">
              <Field label="추가 요청사항">
                <textarea
                  value={form.requestNote}
                  onChange={(e) => update('requestNote', e.target.value)}
                  placeholder="예) 펫이 있어서 마감재 추천 부탁드려요"
                  rows={4}
                  className={inputCls}
                />
              </Field>

              <Field label="상담 가능 시간">
                <input
                  type="text"
                  value={form.consultationTime}
                  onChange={(e) => update('consultationTime', e.target.value)}
                  placeholder="예) 평일 저녁 7시 이후"
                  className={inputCls}
                />
              </Field>

              <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-stone-50 p-4">
                <input
                  type="checkbox"
                  checked={form.contentAgreement}
                  onChange={(e) =>
                    update('contentAgreement', e.target.checked)
                  }
                  className="mt-0.5 h-5 w-5 rounded border-stone-300 text-stone-900 accent-stone-900"
                />
                <span className="text-sm leading-relaxed text-stone-700">
                  개인정보와 주소를 제외한 Before/AI/After 이미지를{' '}
                  <span className="font-medium">
                    이레플랜 홍보 콘텐츠로 활용
                  </span>
                  하는 것에 동의합니다.
                </span>
              </label>
            </div>
          </div>

          {errorMsg && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={status === 'submitting'}
            className="flex w-full items-center justify-center rounded-full bg-stone-900 px-6 py-4 text-base font-semibold text-white transition hover:bg-stone-800 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 md:text-lg"
          >
            {status === 'submitting' ? '전송 중…' : '무료 미리보기 신청 완료'}
          </button>

          <p className="text-center text-xs text-stone-500">
            제출 시 개인정보 처리 안내 및 서비스 이용에 동의한 것으로 간주됩니다.
          </p>
        </form>
      </div>
    </section>
  );
}

const inputCls =
  'w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-base text-stone-900 placeholder-stone-400 transition focus:border-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-900/10';

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 flex items-baseline justify-between">
        <span className="text-sm font-medium text-stone-800">
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </span>
        {hint && <span className="text-xs text-stone-500">{hint}</span>}
      </label>
      {children}
    </div>
  );
}

function CompletionView() {
  return (
    <section
      id="request-form"
      className="scroll-mt-6 bg-white py-20 md:py-28"
    >
      <div className="mx-auto max-w-2xl px-6 md:px-8">
        <div className="rounded-2xl border border-stone-200 bg-stone-50 p-8 text-center md:p-12">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-stone-900 text-white">
            <svg
              className="h-8 w-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-stone-900 md:text-3xl">
            신청이 완료되었습니다.
          </h2>

          <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-stone-700 md:text-base">
            보내주신 사진과 평면도를 확인한 뒤,
            <br />
            실제 시공 가능한 방향으로
            <br />
            AI 리모델링 미리보기를 제작해드립니다.
          </p>

          <p className="mt-5 text-sm text-stone-600">
            결과는 <span className="font-semibold">카카오톡 또는 문자</span>로
            안내드리겠습니다.
          </p>

          <div className="mt-8 rounded-xl bg-white p-4 text-left">
            <p className="text-xs leading-relaxed text-stone-500 md:text-sm">
              AI 이미지는 디자인 방향 제안용이며,
              <br />
              실제 시공은 현장 조건, 자재 수급, 예산에 따라 조정될 수 있습니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
