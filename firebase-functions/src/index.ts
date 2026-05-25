/**
 * 이레플랜 — 신청 들어오면 알림 보내기
 *
 * 트리거: Firestore remodeling_requests/{id} 문서 생성 시
 * 동작:
 *   1. 운영자 Gmail로 알림 이메일 발송
 *   2. Google Sheets에 한 줄 추가
 *
 * 필요한 secret/param:
 *   - GMAIL_USER:    발송용 Gmail 주소 (예: jireh@gmail.com)
 *   - GMAIL_PASS:    Gmail 앱 비밀번호 (2FA 켜고 발급)
 *   - NOTIFY_EMAIL:  알림 받을 이메일 (운영자 본인)
 *   - SHEET_ID:      Google Sheets 문서 ID (URL의 /d/ 뒤 문자열)
 *   - ADMIN_URL:     관리자 대시보드 URL (배포 후 변경)
 */

import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { defineSecret, defineString } from 'firebase-functions/params';
import { logger } from 'firebase-functions/v2';
import * as nodemailer from 'nodemailer';
import { google } from 'googleapis';

const GMAIL_USER = defineSecret('GMAIL_USER');
const GMAIL_PASS = defineSecret('GMAIL_PASS');
const NOTIFY_EMAIL = defineSecret('NOTIFY_EMAIL');
const SHEET_ID = defineSecret('SHEET_ID');
const ADMIN_URL = defineString('ADMIN_URL', {
  default: 'https://your-domain.web.app/admin',
});

type RequestData = {
  name: string;
  phone: string;
  region: string;
  buildingType: string;
  requestNote?: string;
  uploadedFiles?: Array<{ fileName: string; fileUrl: string }>;
  // 과거 신청 호환용 — 새 신청에선 비어있음
  spaceType?: string;
  styleType?: string;
  budgetRange?: string;
  consultationTime?: string;
  contentAgreement?: boolean;
};

export const notifyOnNewRequest = onDocumentCreated(
  {
    document: 'remodeling_requests/{id}',
    region: 'asia-northeast3', // 서울
    secrets: [GMAIL_USER, GMAIL_PASS, NOTIFY_EMAIL, SHEET_ID],
  },
  async (event) => {
    const snap = event.data;
    if (!snap) return;
    const data = snap.data() as RequestData;
    const id = event.params.id;

    // 둘이 실패해도 따로 동작하도록 settled 사용
    const results = await Promise.allSettled([
      sendEmailNotification(id, data),
      appendToSheet(id, data),
    ]);

    results.forEach((r, i) => {
      const label = i === 0 ? 'Email' : 'Sheets';
      if (r.status === 'rejected') {
        logger.error(`${label} 실패`, r.reason);
      } else {
        logger.info(`${label} 성공`);
      }
    });
  }
);

async function sendEmailNotification(id: string, data: RequestData) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: GMAIL_USER.value(), pass: GMAIL_PASS.value() },
  });

  const fileList = (data.uploadedFiles ?? [])
    .map((f, i) => `  ${i + 1}. ${f.fileName}\n     ${f.fileUrl}`)
    .join('\n');

  const subject = `[이레플랜] 새 신청 — ${data.name}님 (${data.region})`;
  const text = [
    '🏠 새 AI 미리보기 신청이 들어왔습니다.',
    '',
    `이름:       ${data.name}`,
    `연락처:     ${data.phone}`,
    `지역:       ${data.region}`,
    `건물 종류:  ${data.buildingType || '-'}`,
    '',
    '추가 요청사항:',
    `  ${data.requestNote || '-'}`,
    '',
    `첨부 파일 (${data.uploadedFiles?.length ?? 0}개):`,
    fileList || '  (없음)',
    '',
    '─────────────────────────',
    `관리자 페이지: ${ADMIN_URL.value()}`,
    `신청 ID: ${id}`,
  ].join('\n');

  await transporter.sendMail({
    from: `이레플랜 알림 <${GMAIL_USER.value()}>`,
    to: NOTIFY_EMAIL.value(),
    subject,
    text,
  });
}

async function appendToSheet(id: string, data: RequestData) {
  // Cloud Functions은 자동으로 default service account 권한 사용.
  // 시트를 service account 이메일에 "편집자"로 공유해야 함.
  const auth = new google.auth.GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  const sheets = google.sheets({ version: 'v4', auth });

  const now = new Date();
  const koTime = new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul',
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(now);

  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID.value(),
    range: 'Sheet1!A:H',
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [
        [
          koTime,
          id,
          data.name,
          data.phone,
          data.region,
          data.buildingType || '',
          data.requestNote || '',
          (data.uploadedFiles ?? []).map((f) => f.fileUrl).join('\n'),
        ],
      ],
    },
  });
}
