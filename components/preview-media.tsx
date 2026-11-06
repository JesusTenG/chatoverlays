'use client';

import { useEffect, useRef, useState } from 'react';
import type { Template } from '@/lib/catalog';
import { useVideoState } from './video-provider';
import { PauseIcon, ExpandIcon } from './icons';

export function PlayIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 11 7-11 7Z" fill="currentColor"/></svg>;
}

export function PreviewMedia({ template, mode, active = true }: { template: Template; mode: 'hero' | 'hover' | 'detail'; active?: boolean }) {
  const { reducedMotion, heroPaused, documentVisible, modalOpen, openPreview } = useVideoState();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [inView, setInView] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const [detailPaused, setDetailPaused] = useState<boolean | null>(null);
  const wantsPlayback = active && inView && documentVisible && !modalOpen && !failed &&
    (mode === 'hero' ? !heroPaused : mode === 'detail' ? (detailPaused === null ? !reducedMotion : !detailPaused) : !reducedMotion && (hovered || focused));

  useEffect(() => {
    const button = buttonRef.current!;
    const container = button.closest('.hero-tile,.template-card') ?? button;
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
  const preview = <button ref={buttonRef} className={`${className}${playing ? ' is-playing' : ''}`} data-preview={template.slug} aria-label={`${template.name} – große Videovorschau öffnen`} onClick={event => openPreview(template, event.currentTarget)}>
    <img src={template.image} alt={`${template.name} Chat-Overlay`} width="1080" height="1080" loading={mode === 'hover' ? 'lazy' : 'eager'} decoding="async" fetchPriority={mode === 'detail' || mode === 'hero' && template.slug === 'neo-tokyo' ? 'high' : 'auto'}/>
    <video ref={videoRef} className="inline-video" data-inline-video={mode} muted loop playsInline preload="none" aria-hidden="true" tabIndex={-1} onPause={() => setPlaying(false)} onError={() => { setFailed(true); setPlaying(false); }}/>
    {mode === 'hover' && <span className="play-indicator"><PlayIcon/></span>}
  </button>;
  if (mode !== 'detail') return preview;
  return <div className="detail-preview">{preview}<div className="media-toolbar"><button className="text-button" aria-pressed={detailPaused === true} onClick={() => setDetailPaused(playing)}>{playing ? <PauseIcon/> : <PlayIcon/>}<span>{playing ? 'Pausieren' : 'Abspielen'}</span></button><button className="text-button" onClick={event => openPreview(template, event.currentTarget)}><ExpandIcon/><span>Große Vorschau</span></button></div></div>;
}
