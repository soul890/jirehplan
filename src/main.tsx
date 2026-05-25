import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.tsx';

// 페이지 진입 시 항상 맨 위에서 시작:
// 1) 브라우저 자동 스크롤 복원 끄기 (뒤로가기 시 이전 위치 복원 X)
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
// 2) URL에 #request-form 같은 hash가 남아있으면 제거 (이전 클릭 흔적이 자동 스크롤 유발 방지)
if (window.location.hash) {
  history.replaceState(
    null,
    '',
    window.location.pathname + window.location.search
  );
}
// 3) 어떤 이유로든 스크롤이 내려가있으면 강제로 맨 위로
window.scrollTo(0, 0);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
