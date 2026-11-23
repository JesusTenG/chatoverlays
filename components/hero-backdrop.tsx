'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { useVideoState } from './video-provider';

type BackdropBubble = { id: number | string; href: string; label: string; preview: string };
const exitEdges = ['top', 'top', 'top', 'top', 'left', 'right', 'left', 'right', 'top', 'top', 'left', 'right', 'right', 'right'] as const;

export function HeroBackdrop({ bubbles }: { bubbles: BackdropBubble[] }) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const { reducedMotion } = useVideoState();

  useEffect(() => {
    const backdrop = backdropRef.current;
    const section = backdrop?.closest('section');
    if (!backdrop || !section) return;
    const images = Array.from(backdrop.querySelectorAll<HTMLElement>('.hero-bubble'));
    if (reducedMotion) {
      images.forEach(image => {
        image.style.setProperty('--bubble-x', '0px');
        image.style.setProperty('--bubble-y', '0px');
      });
      return;
    }

    let frame = 0;
    let visible = true;
    let cancelled = false;
    let entranceStart: number | null = null;
    let entranceFinished = false;
    let journeys: { image: HTMLElement; x: number; y: number }[] = [];
    const measure = () => {
      const bounds = backdrop.getBoundingClientRect();
      const documentTop = bounds.top + window.scrollY;
      journeys = images.map(image => {
        const left = bounds.left + image.offsetLeft;
        const top = documentTop + image.offsetTop;
        const width = image.offsetWidth;
        const height = image.offsetHeight;
        const edge = image.dataset.exit;
        const x = edge === 'left' ? -(left + width + 96)
          : edge === 'right' ? window.innerWidth - left + 96
          : (left + width / 2 - window.innerWidth / 2) * .5;
        const y = edge === 'top' ? -(top + height + 96) : -Math.max(80, height * .55);
        return { image, x, y };
      });
    };
    const update = (now = performance.now()) => {
      frame = 0;
      const bounds = section.getBoundingClientRect();
      const distance = Math.max(0, Math.min(-bounds.top, bounds.height));
      const scrollSpan = Math.min(bounds.height * .72, window.innerHeight * .85);
      let entering = false;
      journeys.forEach(({ image, x, y }, index) => {
        const elapsed = entranceStart === null ? 0 : Math.max(0, now - entranceStart - index * 45);
        const entrance = entranceFinished ? 0 : Math.pow(1 - Math.min(1, elapsed / 1100), 3);
        const scroll = Math.min(1, distance / (scrollSpan * (.8 + index % 3 * .12)));
        const progress = 1 - Math.pow(1 - scroll, 1.25);
        // Scrolling retraces the same path used to enter from the screen edge.
        const travel = entrance + progress * (1 - entrance);
        image.style.setProperty('--bubble-x', `${(x * travel).toFixed(2)}px`);
        image.style.setProperty('--bubble-y', `${(y * travel).toFixed(2)}px`);
        entering ||= entrance > 0;
      });
      if (entranceStart !== null && !entering) entranceFinished = true;
      if (visible && entranceStart !== null && !entranceFinished) schedule();
    };
    const schedule = () => {
      if (visible && !frame) frame = requestAnimationFrame(update);
    };
    const resize = () => { measure(); schedule(); };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) schedule();
    });
    observer.observe(section);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', resize);
    measure();
    update();
    const startEntrance = requestAnimationFrame(() => {
      if (cancelled) return;
      entranceStart = performance.now();
      entranceFinished = window.scrollY > 12;
      schedule();
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(startEntrance);
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', resize);
    };
  }, [reducedMotion]);

  return <div ref={backdropRef} className="hero-backdrop">
    {bubbles.map((bubble, index) => {
      const className = `hero-bubble hero-bubble-${index + 1}`;
      return <Link key={bubble.id} href={bubble.href} prefetch={false} aria-label={bubble.label}
        className={className + ' hero-bubble-live'} data-exit={exitEdges[index]}>
        <iframe src={bubble.preview} title={bubble.label} aria-hidden="true" sandbox="allow-same-origin" tabIndex={-1}/>
      </Link>;
    })}
  </div>;
}
