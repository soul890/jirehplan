# 이레플랜 AI 리모델링

(주)이레플랜의 AI 리모델링 미리보기 상담 신청 랜딩페이지.

신청 폼은 숨고 스타일의 7단계 챗 버블 UI로, 모바일 광고 유입 대상 이탈률을 낮추도록 설계되었습니다. 고객이 사진/평면도를 업로드하면 운영자가 직접 검토 후 AI 미리보기 이미지를 제작하여 카카오톡/문자로 안내하는 구조입니다.

> AI가 자동으로 즉시 생성하는 서비스가 아니라, 전문가 검토를 거쳐 실제 시공 가능한 방향으로 제작합니다.

## 라이브

- 프로덕션: https://jirehplan-8904.pages.dev/

## 스택

- **Frontend**: React 19 + Vite + TypeScript
- **Styling**: Tailwind CSS v4 (Material 3 토큰) + Manrope/Be Vietnam Pro/Pretendard
- **Backend**: Firebase (Firestore + Storage + Auth)
- **Cloud Functions**: 이메일 알림 + Google Sheets 동기화 (`firebase-functions/`)
- **Hosting**: Cloudflare Pages (정적), Firebase (백엔드)

## 로컬 개발

```bash
npm install
cp .env.example .env   # Firebase config 6개 채우기
npm run dev            # http://localhost:5173
```

## 빌드 & 배포

```bash
npm run build                    # dist/ 생성
firebase deploy --only firestore:rules,storage:rules  # 보안 규칙 배포
firebase deploy --only functions # Cloud Functions 배포 (Blaze 플랜 필요)
```

Cloudflare Pages는 GitHub `main` 브랜치 푸시 시 자동 배포.

## 환경변수

| 키 | 설명 |
|---|---|
| `VITE_FIREBASE_API_KEY` | Firebase Web API Key |
| `VITE_FIREBASE_AUTH_DOMAIN` | `{projectId}.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | Firebase 프로젝트 ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | `{projectId}.firebasestorage.app` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | FCM 발신자 ID |
| `VITE_FIREBASE_APP_ID` | Firebase 앱 ID |

Cloud Functions secrets는 별도 (`firebase functions:secrets:set ...`):
`GMAIL_USER`, `GMAIL_PASS`, `NOTIFY_EMAIL`, `SHEET_ID`

## 폴더 구조

```
src/
├── pages/                # LandingPage, AdminLoginPage, AdminDashboardPage
├── components/
│   ├── landing/          # Hero, Service, BeforeAiAfter, HowItWorks, Form, Footer, StickyCta
│   ├── admin/            # StatusBadge
│   └── layout/           # Header
├── hooks/                # useReveal, useStickyAfter
├── lib/                  # firebase, requests (Firestore/Storage helpers)
└── types/                # request 도메인 타입

firebase-functions/       # Cloud Functions (이메일 + Sheets)
public/                   # 정적 자산 (_redirects, demo-render*.png)
```

## 라우트

- `/` 랜딩페이지 (신청 폼)
- `/admin/login` 관리자 로그인
- `/admin` 관리자 대시보드 (Auth 필요)
