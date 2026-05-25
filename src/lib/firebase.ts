import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';
import { getAuth, type Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey);

// Lazy init: .env 없어도 import 시점에 터지지 않도록.
// 실제 호출 시점(폼 제출, 관리자 로그인)에 안내 에러가 나게 됨.
let _app: FirebaseApp | null = null;
let _db: Firestore | null = null;
let _storage: FirebaseStorage | null = null;
let _auth: Auth | null = null;

function getApp() {
  if (!isFirebaseConfigured) {
    throw new Error(
      'Firebase 설정이 없습니다. .env 파일에 VITE_FIREBASE_* 값을 추가해주세요.'
    );
  }
  if (!_app) _app = initializeApp(firebaseConfig);
  return _app;
}

export function getDb(): Firestore {
  if (!_db) _db = getFirestore(getApp());
  return _db;
}

export function getStorageInstance(): FirebaseStorage {
  if (!_storage) _storage = getStorage(getApp());
  return _storage;
}

export function getAuthInstance(): Auth {
  if (!_auth) _auth = getAuth(getApp());
  return _auth;
}
