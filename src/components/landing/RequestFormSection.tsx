import { useState, useRef, useEffect } from 'react';
import { BUILDING_TYPES, type BuildingType } from '../../types/request';
import { submitRequest } from '../../lib/requests';
import { useReveal } from '../../hooks/useReveal';

type FormState = {
  name: string;
  phone: string;
  region: string;
  buildingType: BuildingType | '';
  requestNote: string;
};

const initial: FormState = {
  name: '',
  phone: '',
  region: '',
  buildingType: '',
  requestNote: '',
};

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

const TOTAL_STEPS = 7;

export default function RequestFormSection() {
  const sectionRef = useReveal<HTMLElement>();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(initial);
  const [files, setFiles] = useState<File[]>([]);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');
  const [progressMsg, setProgressMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [pickPending, setPickPending] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentStepRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);

  // 스텝 변경 시 현재 input으로 스크롤 (단, 초기 마운트는 스킵 — 페이지 진입 시 폼으로 점프 방지)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    currentStepRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  }, [step]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((p) => ({ ...p, [key]: value }));
    if (errorMsg) setErrorMsg('');
  }

  function addFiles(list: FileList | File[]) {
    const arr = Array.from(list).filter(
      (f) => f.type === 'application/pdf' || f.type.startsWith('image/')
    );
    if (arr.length === 0) {
      setErrorMsg('이미지 또는 PDF 파일만 업로드 가능합니다.');
      return;
    }
    setErrorMsg('');
    setFiles((p) => [...p, ...arr]);
  }

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    setPickPending(false);
    const list = e.target.files;
    if (!list || list.length === 0) return;
    addFiles(list);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function openPicker() {
    setPickPending(true);
    fileInputRef.current?.click();
    window.setTimeout(() => setPickPending(false), 30000);
  }

  function removeFile(i: number) {
    setFiles((p) => p.filter((_, idx) => idx !== i));
  }

  function validateStep(s: number): string | null {
    switch (s) {
      case 1:
        if (!form.name.trim()) return '성함을 입력해주세요.';
        return null;
      case 2:
        if (!form.phone.trim()) return '연락처를 입력해주세요.';
        if (!/^[\d\s\-+()]{8,}$/.test(form.phone))
          return '연락처 형식을 확인해주세요.';
        return null;
      case 3:
        if (!form.region.trim()) return '지역을 입력해주세요.';
        return null;
      case 4:
        if (!form.buildingType) return '건물 종류를 선택해주세요.';
        return null;
      case 5:
        if (files.length === 0)
          return '사진 또는 평면도를 한 장 이상 업로드해주세요.';
        return null;
      default:
        return null;
    }
  }

  function next() {
    const err = validateStep(step);
    if (err) {
      setErrorMsg(err);
      return;
    }
    setErrorMsg('');
    setStep((s) => Math.min(TOTAL_STEPS, s + 1));
  }

  function jumpTo(s: number) {
    setErrorMsg('');
    setStep(s);
  }

  async function submit() {
    if (submitStatus === 'submitting') return;
    if (!form.buildingType) return;

    setErrorMsg('');
    setSubmitStatus('submitting');
    setProgressMsg('신청을 처리하는 중…');
    try {
      await submitRequest({
        name: form.name,
        phone: form.phone,
        region: form.region,
        buildingType: form.buildingType,
        requestNote: form.requestNote,
        files,
        onProgress: setProgressMsg,
      });
      setSubmitStatus('success');
      requestAnimationFrame(() => {
        document
          .getElementById('request-form')
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    } catch (err) {
      console.error(err);
      setErrorMsg('신청 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      setSubmitStatus('error');
      setProgressMsg('');
    }
  }

  if (submitStatus === 'success') {
    return <CompletionView />;
  }

  // 진행률 계산
  const progress = Math.min(100, Math.round(((step - 1) / TOTAL_STEPS) * 100));

  return (
    <section
      ref={sectionRef}
      id="request-form"
      className="reveal scroll-mt-6 bg-surface-container-low px-4 py-16 md:px-8 md:py-24"
    >
      <div className="mx-auto max-w-xl">
        {/* 상단 진행 바 */}
        <div className="mb-6 rounded-2xl bg-white px-5 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="font-display text-sm font-semibold text-primary md:text-base">
              이레플랜 AI 미리보기 신청
            </p>
            <span className="font-display text-sm font-bold text-on-tertiary-container">
              {progress}%
            </span>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface-container-high">
            <div
              className="h-full rounded-full bg-on-tertiary-container transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* 채팅 영역 */}
        <div className="space-y-4">
          {/* 인사 메시지 */}
          <Bubble side="left" first>
            안녕하세요! 이레플랜이에요. 몇 가지만 여쭤볼게요. 답변을 토대로 실제
            시공 가능한 방향으로 AI 미리보기를 제작해드립니다.
          </Bubble>

          {/* Step 1: 이름 */}
          <Bubble side="left">성함을 알려주세요.</Bubble>
          {step > 1 && (
            <Answer onEdit={() => jumpTo(1)}>{form.name}</Answer>
          )}

          {/* Step 2: 연락처 */}
          {step >= 2 && <Bubble side="left">연락처를 입력해주세요.</Bubble>}
          {step > 2 && (
            <Answer onEdit={() => jumpTo(2)}>{form.phone}</Answer>
          )}

          {/* Step 3: 지역 */}
          {step >= 3 && (
            <Bubble side="left">시공할 지역은 어디인가요?</Bubble>
          )}
          {step > 3 && (
            <Answer onEdit={() => jumpTo(3)}>{form.region}</Answer>
          )}

          {/* Step 4: 건물 종류 */}
          {step >= 4 && (
            <Bubble side="left">어떤 건물이신가요?</Bubble>
          )}
          {step > 4 && form.buildingType && (
            <Answer onEdit={() => jumpTo(4)}>{form.buildingType}</Answer>
          )}

          {/* Step 5: 사진 */}
          {step >= 5 && (
            <Bubble side="left">
              공간 사진이나 평면도를 올려주세요. (여러 장 가능)
            </Bubble>
          )}
          {step > 5 && files.length > 0 && (
            <Answer onEdit={() => jumpTo(5)}>{files.length}개 파일</Answer>
          )}

          {/* Step 6: 요청사항 */}
          {step >= 6 && (
            <Bubble side="left">
              추가로 알려주실 내용이 있나요?
              <span className="ml-1 text-on-surface-variant">(선택)</span>
            </Bubble>
          )}
          {step > 6 && (
            <Answer onEdit={() => jumpTo(6)}>
              {form.requestNote.trim() || '(건너뜀)'}
            </Answer>
          )}

          {/* 현재 단계 입력 카드 */}
          <div ref={currentStepRef} className="pt-2">
            {step === 1 && (
              <InputCard>
                <TextInput
                  value={form.name}
                  onChange={(v) => update('name', v)}
                  placeholder="홍길동"
                  autoFocus
                  onSubmit={next}
                />
              </InputCard>
            )}

            {step === 2 && (
              <InputCard>
                <TextInput
                  type="tel"
                  value={form.phone}
                  onChange={(v) => update('phone', v)}
                  placeholder="010-0000-0000"
                  autoFocus
                  onSubmit={next}
                />
              </InputCard>
            )}

            {step === 3 && (
              <InputCard>
                <TextInput
                  value={form.region}
                  onChange={(v) => update('region', v)}
                  placeholder="예) 서울 강남구"
                  autoFocus
                  onSubmit={next}
                />
                <p className="mt-2 text-[12px] text-outline">
                  시·구 단위로 입력해주세요.
                </p>
              </InputCard>
            )}

            {step === 4 && (
              <InputCard>
                <div className="space-y-2">
                  {BUILDING_TYPES.map((b) => {
                    const active = form.buildingType === b;
                    return (
                      <button
                        key={b}
                        type="button"
                        onClick={() => {
                          update('buildingType', b);
                        }}
                        className={
                          'flex w-full items-center gap-3 rounded-xl border px-4 py-3.5 text-left transition-all ' +
                          (active
                            ? 'border-primary bg-primary/5'
                            : 'border-outline-variant/60 hover:border-primary/50')
                        }
                      >
                        <span
                          className={
                            'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ' +
                            (active
                              ? 'border-primary bg-primary'
                              : 'border-outline')
                          }
                        >
                          {active && (
                            <span className="h-2 w-2 rounded-full bg-on-primary" />
                          )}
                        </span>
                        <span
                          className={
                            'font-display text-base ' +
                            (active
                              ? 'font-semibold text-primary'
                              : 'text-on-surface')
                          }
                        >
                          {b}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </InputCard>
            )}

            {step === 5 && (
              <InputCard>
                <div
                  onClick={openPicker}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragOver(false);
                    if (e.dataTransfer.files?.length > 0)
                      addFiles(e.dataTransfer.files);
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      openPicker();
                    }
                  }}
                  className={
                    'cursor-pointer rounded-xl border-2 border-dashed p-7 text-center transition-all ' +
                    (dragOver
                      ? 'border-on-tertiary-container bg-tertiary-fixed/30 scale-[1.01]'
                      : pickPending
                        ? 'border-on-tertiary-container/60 bg-tertiary-fixed/20'
                        : 'border-outline-variant/60 hover:border-on-tertiary-container/60 hover:bg-surface-container-low')
                  }
                >
                  {pickPending ? (
                    <>
                      <span className="inline-block h-9 w-9 animate-spin rounded-full border-[3px] border-on-tertiary-container/30 border-t-on-tertiary-container" />
                      <p className="mt-3 text-sm text-on-surface-variant">
                        파일 선택창 여는 중…
                      </p>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined mb-2 text-4xl text-outline-variant">
                        cloud_upload
                      </span>
                      <p className="text-sm text-on-surface-variant">
                        {dragOver
                          ? '여기에 놓으세요'
                          : '끌어다 놓거나 클릭해서 업로드'}
                      </p>
                      <p className="mt-1 text-[12px] text-outline">
                        PNG, JPG, PDF · 최대 10MB
                      </p>
                    </>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*,application/pdf"
                    onChange={handleFiles}
                    onClick={(e) => e.stopPropagation()}
                    className="sr-only"
                  />
                </div>

                {files.length > 0 && (
                  <div className="mt-3 flex items-center gap-2 rounded-xl bg-tertiary-fixed/40 px-3 py-2 text-sm">
                    <span
                      className="material-symbols-outlined text-[18px] text-on-tertiary-container"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      check_circle
                    </span>
                    <span className="font-semibold text-primary">
                      {files.length}개 선택됨
                    </span>
                  </div>
                )}

                {files.length > 0 && (
                  <ul className="mt-2 space-y-1.5">
                    {files.map((f, i) => (
                      <li
                        key={`${f.name}-${i}`}
                        className="flex items-center justify-between gap-2 rounded-lg bg-surface-container-low px-2.5 py-1.5 text-xs"
                      >
                        <div className="flex min-w-0 items-center gap-1.5">
                          <span className="material-symbols-outlined text-[16px] text-on-surface-variant">
                            {f.type === 'application/pdf'
                              ? 'picture_as_pdf'
                              : 'image'}
                          </span>
                          <span className="truncate text-primary">
                            {f.name}
                          </span>
                          <span className="shrink-0 text-outline">
                            {(f.size / 1024 / 1024).toFixed(1)}MB
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFile(i);
                          }}
                          className="shrink-0 text-on-surface-variant hover:text-primary"
                        >
                          삭제
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </InputCard>
            )}

            {step === 6 && (
              <InputCard>
                <textarea
                  value={form.requestNote}
                  onChange={(e) => update('requestNote', e.target.value)}
                  placeholder="예) 펫이 있어서 마감재 추천 부탁드려요"
                  rows={4}
                  autoFocus
                  className="w-full resize-none rounded-xl border border-outline-variant/60 bg-transparent px-4 py-3 text-base text-primary placeholder-outline transition-all focus:border-primary focus:outline-none"
                />
              </InputCard>
            )}

            {step === 7 && (
              <InputCard>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 rounded-xl bg-tertiary-fixed/30 p-4">
                    <span
                      className="material-symbols-outlined text-on-tertiary-container"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      info
                    </span>
                    <p className="text-[13px] leading-relaxed text-primary md:text-sm">
                      AI가 즉시 자동 생성하는 서비스가 아닙니다. 신청 후 이레플랜이
                      직접 검토하여{' '}
                      <span className="font-semibold">실제 시공 가능한 방향</span>
                      으로 AI 미리보기를 제작해드립니다.
                    </p>
                  </div>

                  <p className="text-center text-sm text-on-surface-variant">
                    영업일 기준 1~2일 이내에 카카오톡 또는 문자로 결과를
                    안내드립니다.
                  </p>
                </div>
              </InputCard>
            )}

            {/* 에러 표시 */}
            {errorMsg && (
              <div className="mt-3 flex items-start gap-2 rounded-xl bg-error-container/50 px-4 py-3 text-sm text-on-error-container">
                <span className="material-symbols-outlined text-[18px]">
                  warning
                </span>
                {errorMsg}
              </div>
            )}

            {/* 액션 버튼 */}
            <div className="mt-4 flex flex-col gap-2">
              {step < TOTAL_STEPS && step !== 6 && (
                <button
                  type="button"
                  onClick={next}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-base font-bold text-on-primary transition hover:bg-primary-container active:scale-[0.98]"
                >
                  다음
                  <span className="material-symbols-outlined">
                    arrow_forward
                  </span>
                </button>
              )}

              {step === 6 && (
                <>
                  <button
                    type="button"
                    onClick={next}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-base font-bold text-on-primary transition hover:bg-primary-container active:scale-[0.98]"
                  >
                    다음
                    <span className="material-symbols-outlined">
                      arrow_forward
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      update('requestNote', '');
                      setStep(7);
                    }}
                    className="w-full rounded-2xl bg-transparent py-3 text-sm text-on-surface-variant hover:text-primary"
                  >
                    건너뛰기
                  </button>
                </>
              )}

              {step === TOTAL_STEPS && (
                <button
                  type="button"
                  onClick={submit}
                  disabled={submitStatus === 'submitting'}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-5 text-base font-bold text-on-primary shadow-xl transition hover:bg-primary-container active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 md:text-lg"
                >
                  {submitStatus === 'submitting' ? (
                    <>
                      <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-on-primary/30 border-t-on-primary" />
                      {progressMsg || '전송 중…'}
                    </>
                  ) : (
                    <>
                      무료 AI 미리보기 신청하기
                      <span className="material-symbols-outlined">
                        arrow_forward
                      </span>
                    </>
                  )}
                </button>
              )}

              {submitStatus === 'submitting' && (
                <p className="text-center text-xs text-on-surface-variant md:text-sm">
                  사진 크기에 따라 10~30초 정도 걸릴 수 있어요.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// 서브 컴포넌트
// ─────────────────────────────────────────────

function Bubble({
  side,
  first,
  children,
}: {
  side: 'left' | 'right';
  first?: boolean;
  children: React.ReactNode;
}) {
  if (side === 'left') {
    return (
      <div className="flex items-end gap-2">
        {first && (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-on-primary">
            <span
              className="material-symbols-outlined text-[18px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              architecture
            </span>
          </div>
        )}
        <div
          className={
            'max-w-[85%] rounded-2xl bg-white px-4 py-3 text-sm leading-relaxed text-primary shadow-sm md:text-base ' +
            (first ? '' : 'ml-10')
          }
        >
          {children}
        </div>
      </div>
    );
  }
  return (
    <div className="flex justify-end">
      <div className="max-w-[85%] rounded-2xl bg-primary px-4 py-3 text-sm leading-relaxed text-on-primary md:text-base">
        {children}
      </div>
    </div>
  );
}

function Answer({
  children,
  onEdit,
}: {
  children: React.ReactNode;
  onEdit: () => void;
}) {
  return (
    <div className="flex flex-col items-end gap-1">
      <div className="max-w-[85%] rounded-2xl bg-primary px-4 py-2.5 text-sm text-on-primary md:text-base">
        {children}
      </div>
      <button
        type="button"
        onClick={onEdit}
        className="text-[12px] text-on-surface-variant underline-offset-2 hover:text-primary hover:underline"
      >
        수정
      </button>
    </div>
  );
}

function InputCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm md:p-6">{children}</div>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
  type = 'text',
  autoFocus,
  onSubmit,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  autoFocus?: boolean;
  onSubmit?: () => void;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      autoFocus={autoFocus}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          onSubmit?.();
        }
      }}
      className="w-full border-0 border-b-2 border-outline-variant bg-transparent pb-2 text-lg text-primary placeholder-outline focus:border-primary focus:outline-none"
    />
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
            <span className="material-symbols-outlined text-[36px]">check</span>
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
            <span className="material-symbols-outlined text-[18px]">chat</span>
            결과는 카카오톡 또는 문자로 안내드리겠습니다.
          </div>

          <p className="mt-8 rounded-2xl bg-surface-container-low p-4 text-left text-[12px] leading-relaxed text-on-surface-variant md:text-[13px]">
            AI 이미지는 디자인 방향 제안용이며, 실제 시공은 현장 조건, 자재 수급,
            예산에 따라 조정될 수 있습니다.
          </p>
        </div>
      </div>
    </section>
  );
}
