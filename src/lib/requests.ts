import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  serverTimestamp,
  orderBy,
  query,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getDb, getStorageInstance } from './firebase';
import type {
  RemodelingRequest,
  RemodelingRequestDoc,
  RequestStatus,
  UploadedFile,
} from '../types/request';

const COLLECTION = 'remodeling_requests';

export type NewRequestInput = Omit<
  RemodelingRequest,
  'uploadedFiles' | 'status' | 'createdAt' | 'updatedAt'
> & {
  files: File[];
  onProgress?: (message: string) => void;
};

/**
 * 신청 폼 제출:
 * 1. 파일들을 Storage에 업로드
 * 2. URL과 함께 Firestore에 신청 문서 생성
 */
export async function submitRequest(input: NewRequestInput): Promise<string> {
  const db = getDb();
  const storage = getStorageInstance();
  const requestId = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;
  const total = input.files.length;

  // 1. 파일 업로드 (한 장씩, 진행 상황 보고)
  const uploadedFiles: UploadedFile[] = [];
  for (let i = 0; i < total; i++) {
    const file = input.files[i];
    input.onProgress?.(
      total > 1 ? `사진 업로드 중… (${i + 1}/${total})` : '사진 업로드 중…'
    );
    const safeName = file.name.replace(/[^\w.\-가-힣]/g, '_');
    const path = `requests/${requestId}/${safeName}`;
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    const fileUrl = await getDownloadURL(storageRef);
    uploadedFiles.push({
      fileName: file.name,
      fileUrl,
      fileType: file.type,
    });
  }

  // 2. Firestore 저장
  input.onProgress?.('신청 정보 저장 중…');
  const { files: _files, onProgress: _onProgress, ...rest } = input;
  void _files;
  void _onProgress;
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...rest,
    uploadedFiles,
    status: '접수 완료' satisfies RequestStatus,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return docRef.id;
}

export async function fetchAllRequests(): Promise<RemodelingRequestDoc[]> {
  const db = getDb();
  const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(
    (d) => ({ id: d.id, ...d.data() }) as RemodelingRequestDoc
  );
}

export async function updateRequestStatus(
  requestId: string,
  status: RequestStatus
): Promise<void> {
  const db = getDb();
  const docRef = doc(db, COLLECTION, requestId);
  await updateDoc(docRef, { status, updatedAt: serverTimestamp() });
}
