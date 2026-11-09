'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useLocale } from './locale-provider';
import { localizePath } from '@/lib/routing.mjs';
import type { Template } from '@/lib/catalog';
import { useVideoState } from './video-provider';
import { PauseIcon, PlayIcon } from './icons';

export function PreviewMedia({ template, mode, active = true }: { template: Template; mode: 'hero' | 'hover' | 'detail'; active?: boolean }) {
  const { locale, t } = useLocale();
  const { reducedMotion, heroPaused, documentVisible } = useVideoState();
  const mediaRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [inView, setInView] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const [detailPaused, setDetailPaused] = useState<boolean | null>(null);
  const wantsPlayback = active && inView && documentVisible && !failed &&
    (mode === 'hero' ? !heroPaused : mode === 'detail' ? (detailPaused === null ? !reducedMotion : !detailPaused) : !reducedMotion && (hovered || focused));

  useEffect(() => {
    const media = mediaRef.current!;
    const container = media.closest('.hero-tile,.template-card') ?? media;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: .12 });
    const enter = (event: Event) => { if ((event as PointerEvent).pointerType !== 'touch') setHovered(true); };
    const leave = () => setHovered(false);
    const focusIn = () => setFocused(true);
    const focusOut = (event: Event) => { if (!container.contains((event as FocusEvent).relatedTarget as Node | null)) setFocused(false); };
    observer.observe(container);
    container.addEventListener('pointerenter', enter);
    container.addEventListener('pointerleave', leave);
    container.addEventListener('focusin', focusIn);
    container.addEventListener('focusout', focusOut);
    return () => { observer.disconnect(); container.removeEventListener('pointerenter', enter); container.removeEventListener('pointerleave', leave); container.removeEventListener('focusin', focusIn); container.removeEventListener('focusout', focusOut); };
  }, [mode]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !template.video) return;
    let cancelled = false;
    if (wantsPlayback) {
      if (video.getAttribute('src') !== template.video) video.src = template.video;
      video.muted = true;
      void video.play().then(() => { if (cancelled) return; setPlaying(true); }).catch(() => { if (!cancelled) setPlaying(false); });
    } else { video.pause(); setPlaying(false); }
    return () => { cancelled = true; video.pause(); };
  }, [wantsPlayback, template.video]);

  const className = mode === 'hero' ? 'hero-media' : mode === 'detail' ? 'detail-media' : 'card-media';
  const sizes = mode === 'hero' ? '(max-width: 680px) 47vw, 23vw' : mode === 'detail' ? '(max-width: 680px) 100vw, 50vw' : '(max-width: 680px) 100vw, (max-width: 900px) 50vw, 33vw';
  const media = <>
    <img src={template.image} srcSet={`${template.image.replace('.webp', '.360.webp')} 360w, ${template.image.replace('.webp', '.720.webp')} 720w, ${template.image} 1080w`} sizes={sizes} alt={`${template.name} ${t.ui.overlay}`} width="1080" height="1080" loading={mode === 'hover' ? 'lazy' : 'eager'} decoding="async" fetchPriority={mode === 'detail' || mode === 'hero' && template.slug === 'neo-tokyo' ? 'high' : 'auto'}/>
    <video ref={videoRef} className="inline-video" data-inline-video={mode} muted loop playsInline preload="none" aria-hidden="true" tabIndex={-1} onPause={() => setPlaying(false)} onError={() => { setFailed(true); setPlaying(false); }}/>
  </>;
  const mediaClass = `${className}${playing ? ' is-playing' : ''}`;
  if (mode !== 'detail') return <Link ref={node => { mediaRef.current = node; }} prefetch={false} className={mediaClass} data-preview={template.slug} href={localizePath(`/overlays/${template.slug}/`, locale)} aria-label={`${template.name} – ${t.ui.details}`}>{media}</Link>;
  return <div className="detail-preview"><div ref={node => { mediaRef.current = node; }} className={mediaClass}>{media}</div><div className="media-toolbar"><button className="text-button" aria-pressed={detailPaused === true} onClick={() => setDetailPaused(playing)}>{playing ? <PauseIcon/> : <PlayIcon/>}<span>{playing ? t.ui.pause : t.ui.play}</span></button></div></div>;
}
