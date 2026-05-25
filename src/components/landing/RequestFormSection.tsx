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
import { useReveal } from '../../hooks/useReveal';

type FormState = {
  name: string;
  phone: string;
  region: string;
  spaceType: SpaceType | '';
  styleType: StyleType | '';
  budgetRange: BudgetRange | '';
  requestNote: string;
  contentAgreement: boolean;
};

const initial: FormState = {
  name: '',
  phone: '',
  region: '',
  spaceType: '',
  styleType: '',
  budgetRange: '',
  requestNote: '',
  contentAgreement: false,
};

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

export default function RequestFormSection() {
  const sectionRef = useReveal<HTMLElement>();
  const [form, setForm] = useState<FormState>(initial);
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((p) => ({ ...p, [key]: value }));
  }

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const list = e.target.files;
    if (!list) return;
    setFiles((p) => [...p, ...Array.from(list)]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function removeFile(i: number) {
    setFiles((p) => p.filter((_, idx) => idx !== i));
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
        consultationTime: '',
        contentAgreement: form.contentAgreement,
        files,
      });
      setStatus('success');
      requestAnimationFrame(() => {
        document.getElementById('request-form')?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      });
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
      ref={sectionRef}
      id="request-form"
      className="reveal scroll-mt-6 bg-surface px-5 py-20 md:px-16 md:py-24"
    >
      <div className="mx-auto max-w-3xl">
        <div className="mb-10 text-center">
          <h3 className="mb-3 font-display text-2xl font-semibold tracking-[-0.01em] text-primary md:text-[32px]">
            지금 무료 AI 미리보기를 신청하세요
          </h3>
          <p className="text-sm text-on-surface-variant md:text-base">
            전문가의 손길이 닿은 AI 시뮬레이션은 영업일 1~2일 내에 발송됩니다.
          </p>
        </div>

        {/* 오해 방지 안내 */}
        <div className="mb-8 flex items-start gap-3 rounded-2xl border border-tertiary-fixed bg-tertiary-fixed/30 px-4 py-3.5 md:px-5 md:py-4">
          <span
            className="material-symbols-outlined text-on-tertiary-container"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            info
          </span>
          <p className="text-[13px] leading-relaxed text-primary md:text-sm">
            AI가 즉시 자동 생성하는 서비스가 아닙니다. 신청 후 이레플랜이 직접
            검토하여{' '}
            <span className="font-semibold">실제 시공 가능한 방향</span>으로 AI
            미리보기를 제작해드립니다.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-7 rounded-3xl border border-outline/5 bg-white p-6 shadow-xl transition-all duration-500 hover:shadow-2xl md:p-10"
        >
          {/* 이름 + 연락처 */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Field label="이름" required>
              <input
                type="text"
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                placeholder="성함을 입력하세요"
                className={underlineCls}
                required
              />
            </Field>
            <Field label="연락처" required>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => update('phone', e.target.value)}
                placeholder="010-0000-0000"
                className={underlineCls}
                required
              />
            </Field>
          </div>

          {/* 지역 */}
          <Field label="지역" required>
            <input
              type="text"
              value={form.region}
              onChange={(e) => update('region', e.target.value)}
              placeholder="예: 서울 강남구"
              className={underlineCls}
              required
            />
          </Field>

          {/* 희망 공간 — 핀 버튼 */}
          <PillField
            label="리모델링 희망 공간"
            required
            options={SPACE_TYPES}
            value={form.spaceType}
            onChange={(v) => update('spaceType', v as SpaceType)}
          />

          {/* 스타일 — 핀 버튼 */}
          <PillField
            label="원하는 스타일"
            required
            options={STYLE_TYPES}
            value={form.styleType}
            onChange={(v) => update('styleType', v as StyleType)}
          />

          {/* 예산 — 핀 버튼 */}
          <PillField
            label="예산 범위"
            required
            options={BUDGET_RANGES}
            value={form.budgetRange}
            onChange={(v) => update('budgetRange', v as BudgetRange)}
          />

          {/* 파일 업로드 */}
          <Field label="사진 또는 평면도" required hint="여러 장 가능 · jpg, png, pdf">
            <label className="group block cursor-pointer">
              <div className="rounded-2xl border-2 border-dashed border-outline-variant/60 p-8 text-center transition-all hover:border-on-tertiary-container/60 hover:bg-surface-container-low">
                <span className="material-symbols-outlined mb-2 text-4xl text-outline-variant transition-colors group-hover:text-on-tertiary-container">
                  cloud_upload
                </span>
                <p className="text-on-surface-variant">
                  파일을 끌어다 놓거나 클릭하여 업로드
                </p>
                <p className="mt-1 text-[12px] text-outline">
                  PNG, JPG, PDF · 최대 10MB
                </p>
              </div>
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
              <ul className="mt-3 space-y-2">
                {files.map((f, i) => (
                  <li
                    key={`${f.name}-${i}`}
                    className="flex items-center justify-between gap-3 rounded-xl bg-surface-container-low px-3 py-2 text-sm"
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-on-surface-variant">
                        {f.type === 'application/pdf'
                          ? 'picture_as_pdf'
                          : 'image'}
                      </span>
                      <span className="truncate text-primary">{f.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(i)}
                      className="shrink-0 rounded-md px-2 py-1 text-xs text-on-surface-variant hover:bg-surface-container-high"
                    >
                      삭제
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </Field>

          {/* 추가 요청사항 */}
          <Field label="추가 요청사항" hint="선택">
            <textarea
              value={form.requestNote}
              onChange={(e) => update('requestNote', e.target.value)}
              placeholder="특별히 신경 쓰고 싶은 부분이나 궁금한 점을 적어주세요."
              rows={4}
              className="w-full rounded-2xl border border-outline-variant/60 bg-transparent px-4 py-3 text-base transition-all duration-300 focus:border-on-tertiary-container focus:outline-none"
            />
          </Field>

          {/* 쇼츠 동의 */}
          <label className="flex cursor-pointer items-start gap-3 rounded-2xl bg-surface-container-low p-4">
            <input
              type="checkbox"
              checked={form.contentAgreement}
              onChange={(e) => update('contentAgreement', e.target.checked)}
              className="mt-0.5 h-5 w-5 accent-primary"
            />
            <span className="text-[13px] leading-relaxed text-on-surface-variant md:text-sm">
              개인정보와 주소를 제외한 Before/AI/After 이미지를{' '}
              <span className="font-semibold text-primary">
                이레플랜 홍보 콘텐츠로 활용
              </span>
              하는 것에 동의합니다.
            </span>
          </label>

          {errorMsg && (
            <p className="flex items-start gap-2 rounded-xl bg-error-container/50 px-4 py-3 text-sm text-on-error-container">
              <span className="material-symbols-outlined text-[18px]">
                warning
              </span>
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={status === 'submitting'}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-5 text-lg font-bold text-on-primary shadow-xl transition-transform hover:scale-[1.01] active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === 'submitting' ? (
              '전송 중…'
            ) : (
              <>
                무료 AI 미리보기 신청하기
                <span className="material-symbols-outlined">
                  arrow_forward
                </span>
              </>
            )}
          </button>

          <p className="flex items-start gap-2 rounded-xl bg-surface-container-low p-4 text-[12px] leading-relaxed text-on-surface-variant md:text-[13px]">
            <span className="material-symbols-outlined text-[16px]">info</span>
            AI 미리보기 이미지는 디자인 방향 제안용이며, 실제 시공 결과는 현장
            조건, 자재 수급, 예산에 따라 달라질 수 있습니다.
          </p>
        </form>
      </div>
    </section>
  );
}

const underlineCls =
  'field-underline w-full border-0 border-b border-outline-variant bg-transparent py-3 text-base text-primary placeholder-outline transition-all duration-300';

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
    <div className="space-y-2 group">
      <label className="flex items-center justify-between">
        <span className="font-display text-[11px] font-bold uppercase tracking-[0.05em] text-on-surface-variant md:text-[12px]">
          {label}
          {required && (
            <span className="ml-1 text-error">*</span>
          )}
        </span>
        {hint && (
          <span className="text-[11px] text-outline">{hint}</span>
        )}
      </label>
      {children}
    </div>
  );
}

function PillField<T extends string>({
  label,
  required,
  options,
  value,
  onChange,
}: {
  label: string;
  required?: boolean;
  options: readonly T[];
  value: T | '';
  onChange: (v: T) => void;
}) {
  return (
    <div className="space-y-3">
      <label className="block font-display text-[11px] font-bold uppercase tracking-[0.05em] text-on-surface-variant md:text-[12px]">
        {label}
        {required && <span className="ml-1 text-error">*</span>}
      </label>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = value === opt;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(opt)}
              className={
                'rounded-full px-4 py-2 text-[13px] transition-all md:text-sm ' +
                (active
                  ? 'border border-primary bg-primary text-on-primary'
                  : 'border border-outline-variant text-on-surface-variant hover:border-primary hover:bg-primary/5')
              }
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function CompletionView() {
  return (
    <section
      id="request-form"
      className="scroll-mt-6 bg-surface px-5 py-20 md:px-16 md:py-24"
    >
      <div className="mx-auto max-w-2xl">
        <div className="rounded-3xl border border-outline/5 bg-white p-8 text-center shadow-xl md:p-12">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-on-primary">
            <span className="material-symbols-outlined text-[36px]">
              check
            </span>
          </div>

          <h2 className="font-display text-2xl font-bold text-primary md:text-3xl">
            신청이 완료되었습니다.
          </h2>

          <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-on-surface-variant md:text-base">
            보내주신 사진과 평면도를 확인한 뒤
            <br />
            실제 시공 가능한 방향으로
            <br />
            AI 미리보기를 제작해드립니다.
          </p>

          <div className="mx-auto mt-6 inline-flex items-center gap-2 rounded-full bg-secondary-container px-4 py-2 text-sm text-on-secondary-container">
            <span className="material-symbols-outlined text-[18px]">
              chat
            </span>
            결과는 카카오톡 또는 문자로 안내드리겠습니다.
          </div>

          <p className="mt-8 rounded-2xl bg-surface-container-low p-4 text-left text-[12px] leading-relaxed text-on-surface-variant md:text-[13px]">
            AI 이미지는 디자인 방향 제안용이며, 실제 시공은 현장 조건, 자재
            수급, 예산에 따라 조정될 수 있습니다.
          </p>
        </div>
      </div>
    </section>
  );
}
