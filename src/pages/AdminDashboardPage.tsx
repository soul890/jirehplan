import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { getAuthInstance, isFirebaseConfigured } from '../lib/firebase';
import {
  fetchAllRequests,
  updateRequestStatus,
} from '../lib/requests';
import {
  REQUEST_STATUSES,
  type RemodelingRequestDoc,
  type RequestStatus,
} from '../types/request';
import StatusBadge from '../components/admin/StatusBadge';

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [requests, setRequests] = useState<RemodelingRequestDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setAuthChecked(true);
      navigate('/admin/login');
      return;
    }
    const unsub = onAuthStateChanged(getAuthInstance(), (u) => {
      setUser(u);
      setAuthChecked(true);
      if (!u) navigate('/admin/login');
    });
    return unsub;
  }, [navigate]);

  useEffect(() => {
    if (!user) return;
    void loadRequests();
  }, [user]);

  async function loadRequests() {
    setLoading(true);
    try {
      const data = await fetchAllRequests();
      setRequests(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(id: string, status: RequestStatus) {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
    try {
      await updateRequestStatus(id, status);
    } catch (err) {
      console.error(err);
      await loadRequests();
    }
  }

  if (!authChecked) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-stone-500">
        로딩 중…
      </div>
    );
  }
  if (!user) return null;

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
          <div>
            <p className="text-xs font-medium tracking-wide text-amber-700">
              이레플랜
            </p>
            <h1 className="text-lg font-semibold text-stone-900">관리자</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-stone-500 md:inline">
              {user.email}
            </span>
            <button
              onClick={() => signOut(getAuthInstance())}
              className="rounded-md border border-stone-300 px-3 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-50"
            >
              로그아웃
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-10">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-stone-900 md:text-2xl">
              상담 신청 목록
            </h2>
            <p className="mt-1 text-xs text-stone-500 md:text-sm">
              총 {requests.length}건
            </p>
          </div>
          <button
            onClick={loadRequests}
            className="rounded-md border border-stone-300 bg-white px-3 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-50"
          >
            새로고침
          </button>
        </div>

        {loading ? (
          <p className="py-12 text-center text-sm text-stone-500">불러오는 중…</p>
        ) : requests.length === 0 ? (
          <p className="py-12 text-center text-sm text-stone-500">
            아직 신청 내역이 없습니다.
          </p>
        ) : (
          <div className="overflow-hidden rounded-xl border border-stone-200 bg-white">
            <table className="min-w-full divide-y divide-stone-200 text-sm">
              <thead className="bg-stone-50 text-xs uppercase tracking-wide text-stone-500">
                <tr>
                  <th className="px-4 py-3 text-left">신청일</th>
                  <th className="px-4 py-3 text-left">이름</th>
                  <th className="px-4 py-3 text-left">연락처</th>
                  <th className="px-4 py-3 text-left">지역</th>
                  <th className="px-4 py-3 text-left">건물</th>
                  <th className="px-4 py-3 text-left">파일</th>
                  <th className="px-4 py-3 text-left">상태</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {requests.map((r) => (
                  <RequestRow
                    key={r.id}
                    req={r}
                    expanded={expandedId === r.id}
                    onToggle={() =>
                      setExpandedId((cur) => (cur === r.id ? null : r.id))
                    }
                    onStatusChange={(s) => handleStatusChange(r.id, s)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

function RequestRow({
  req,
  expanded,
  onToggle,
  onStatusChange,
}: {
  req: RemodelingRequestDoc;
  expanded: boolean;
  onToggle: () => void;
  onStatusChange: (s: RequestStatus) => void;
}) {
  const createdAt = req.createdAt?.toDate?.() ?? null;
  const createdLabel = createdAt
    ? createdAt.toLocaleString('ko-KR', {
        year: '2-digit',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '-';

  return (
    <>
      <tr
        onClick={onToggle}
        className="cursor-pointer transition hover:bg-stone-50"
      >
        <td className="whitespace-nowrap px-4 py-3 text-stone-600">
          {createdLabel}
        </td>
        <td className="whitespace-nowrap px-4 py-3 font-medium text-stone-900">
          {req.name}
        </td>
        <td className="whitespace-nowrap px-4 py-3 text-stone-700">
          {req.phone}
        </td>
        <td className="whitespace-nowrap px-4 py-3 text-stone-700">
          {req.region}
        </td>
        <td className="whitespace-nowrap px-4 py-3 text-stone-700">
          {req.buildingType || '-'}
        </td>
        <td className="whitespace-nowrap px-4 py-3 text-stone-700">
          {req.uploadedFiles?.length ?? 0}개
        </td>
        <td
          className="whitespace-nowrap px-4 py-3"
          onClick={(e) => e.stopPropagation()}
        >
          <select
            value={req.status}
            onChange={(e) => onStatusChange(e.target.value as RequestStatus)}
            className="rounded-md border border-stone-300 bg-white px-2 py-1 text-xs font-medium"
          >
            {REQUEST_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </td>
      </tr>
      {expanded && (
        <tr className="bg-stone-50">
          <td colSpan={7} className="px-6 py-5">
            <div className="grid gap-4 md:grid-cols-2">
              <DetailItem
                label="건물 종류"
                value={req.buildingType || '-'}
              />
              <DetailItem
                label="현재 상태"
                value={<StatusBadge status={req.status} />}
              />

              {/* 과거 신청 호환용 — 값이 있을 때만 표시 */}
              {req.spaceType && (
                <DetailItem label="(이전) 희망 공간" value={req.spaceType} />
              )}
              {req.styleType && (
                <DetailItem label="(이전) 스타일" value={req.styleType} />
              )}
              {req.budgetRange && (
                <DetailItem label="(이전) 예산" value={req.budgetRange} />
              )}
              {req.consultationTime && (
                <DetailItem
                  label="(이전) 상담 가능 시간"
                  value={req.consultationTime}
                />
              )}
              {req.contentAgreement !== undefined && (
                <DetailItem
                  label="쇼츠 활용 동의"
                  value={req.contentAgreement ? '동의' : '미동의'}
                />
              )}

              <div className="md:col-span-2">
                <p className="mb-1.5 text-xs font-medium text-stone-500">
                  추가 요청사항
                </p>
                <p className="whitespace-pre-wrap text-sm text-stone-800">
                  {req.requestNote || '-'}
                </p>
              </div>

              <div className="md:col-span-2">
                <p className="mb-1.5 text-xs font-medium text-stone-500">
                  업로드 파일
                </p>
                <div className="flex flex-wrap gap-3">
                  {(req.uploadedFiles ?? []).map((f, i) => (
                    <a
                      key={i}
                      href={f.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block overflow-hidden rounded-lg border border-stone-200 bg-white"
                    >
                      {f.fileType.startsWith('image/') ? (
                        <img
                          src={f.fileUrl}
                          alt={f.fileName}
                          className="h-32 w-32 object-cover"
                        />
                      ) : (
                        <div className="flex h-32 w-32 items-center justify-center bg-stone-100 text-xs text-stone-600">
                          {f.fileName}
                        </div>
                      )}
                      <p className="truncate border-t border-stone-100 px-2 py-1.5 text-xs text-stone-600 group-hover:bg-stone-50">
                        {f.fileName}
                      </p>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div>
      <p className="mb-1 text-xs font-medium text-stone-500">{label}</p>
      <div className="text-sm text-stone-800">{value}</div>
    </div>
  );
}
