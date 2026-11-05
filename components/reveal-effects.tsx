'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useVideoState } from './video-provider';

export function RevealEffects() {
  const pathname = usePathname();
  const { reducedMotion } = useVideoState();
  useEffect(() => {
    if (reducedMotion) { document.getAnimations().forEach(animation => animation.cancel()); return; }
    const animations: Animation[] = [];
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        animations.push(entry.target.animate([{ opacity: 0, transform: 'translateY(18px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 650, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'backwards' }));
      }
    }, { threshold: .08 });
    document.querySelectorAll('[data-reveal],.template-card,.guide h2').forEach(element => observer.observe(element));
    return () => { observer.disconnect(); animations.forEach(animation => animation.cancel()); };
  }, [pathname, reducedMotion]);
  return null;
}
