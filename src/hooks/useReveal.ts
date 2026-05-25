import { useEffect, useRef } from 'react';

/**
 * IntersectionObserver 기반 reveal-on-scroll 훅.
 * 컴포넌트가 뷰포트에 들어오면 'active' 클래스 추가.
 */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('active');
            obs.unobserve(e.target);
          }
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return ref;
}

/**
 * 헤더가 hero를 넘어가면 sticky CTA를 표시.
 */
export function useStickyAfter(heroId: string, offset = 200) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    function onScroll() {
      const hero = document.getElementById(heroId);
      if (!hero || !el) return;
      const bottom = hero.offsetTop + hero.offsetHeight;
      if (window.scrollY > bottom - offset) {
        el.classList.add('visible');
      } else {
        el.classList.remove('visible');
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [heroId, offset]);

  return ref;
}
