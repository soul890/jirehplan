import type { Timestamp } from 'firebase/firestore';

export const BUILDING_TYPES = ['주거시설', '상업시설'] as const;
export type BuildingType = (typeof BUILDING_TYPES)[number];

// 이전 폼에서 사용했던 옵션들. 새 폼에서는 안 받지만, 과거 신청 표시 호환을 위해 유지.
export const SPACE_TYPES = [
  '욕실',
  '주방',
  '거실',
  '방',
  '현관',
  '아파트 전체',
  '기타',
] as const;
export type SpaceType = (typeof SPACE_TYPES)[number];

export const STYLE_TYPES = [
  '호텔식',
  '화이트 모던',
  '우드톤',
  '미니멀',
  '따뜻한 감성',
  '고급 대리석 느낌',
  '가성비 실속형',
  '아직 모르겠음',
] as const;
export type StyleType = (typeof STYLE_TYPES)[number];

export const BUDGET_RANGES = [
  '300만 원 이하',
  '300~500만 원',
  '500~1,000만 원',
  '1,000~2,000만 원',
  '2,000만 원 이상',
  '아직 모르겠음',
] as const;
export type BudgetRange = (typeof BUDGET_RANGES)[number];

export const REQUEST_STATUSES = [
  '접수 완료',
  'AI 이미지 제작 중',
  '결과 전달 완료',
  '견적 상담 예정',
  '계약 완료',
  '보류',
] as const;
export type RequestStatus = (typeof REQUEST_STATUSES)[number];

export type UploadedFile = {
  fileName: string;
  fileUrl: string;
  fileType: string;
};

export type RemodelingRequest = {
  // 필수
  name: string;
  phone: string;
  region: string;
  buildingType: BuildingType;
  uploadedFiles: UploadedFile[];

  // 선택
  requestNote: string;

  // (legacy) 이전 폼에서 받던 항목 — 과거 신청 호환용. 새 신청에선 빈값.
  spaceType?: SpaceType | '';
  styleType?: StyleType | '';
  budgetRange?: BudgetRange | '';
  consultationTime?: string;
  contentAgreement?: boolean;

  // 시스템
  status: RequestStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

// Firestore에서 가져올 때 id 포함
export type RemodelingRequestDoc = RemodelingRequest & { id: string };
