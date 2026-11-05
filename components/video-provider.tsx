'use client';

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Template } from '@/lib/catalog';
import { ChatStyleLink, ChatStyleLogo } from './site-chrome';

type VideoState = {
  reducedMotion: boolean;
  documentVisible: boolean;
  heroPaused: boolean;
  modalOpen: boolean;
  toggleHero: () => void;
  openPreview: (template: Template, trigger: HTMLElement) => void;
};
const VideoContext = createContext<VideoState | null>(null);
export function useVideoState() {
  const value = useContext(VideoContext);
  if (!value) throw new Error('Video components require VideoProvider');
  return value;
}

export function VideoProvider({ children }: { children: ReactNode }) {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [documentVisible, setDocumentVisible] = useState(true);
  const [heroPaused, setHeroPaused] = useState(false);
  const [selected, setSelected] = useState<Template | null>(null);
  const [mediaError, setMediaError] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const syncMotion = () => { setReducedMotion(media.matches); setHeroPaused(media.matches); };
    const syncVisibility = () => { setDocumentVisible(!document.hidden); if (document.hidden) videoRef.current?.pause(); };
    syncMotion(); syncVisibility();
    media.addEventListener('change', syncMotion);
    document.addEventListener('visibilitychange', syncVisibility);
    return () => { media.removeEventListener('change', syncMotion); document.removeEventListener('visibilitychange', syncVisibility); };
  }, []);

  useEffect(() => { dialogRef.current?.close(); setSelected(null); }, [pathname]);

  useEffect(() => {
    if (!selected) return;
    const dialog = dialogRef.current!;
    const video = videoRef.current!;
    dialog.showModal();
    document.body.classList.add('no-scroll');
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) void video.play().catch(() => {});
    return () => {
      video.pause();
      document.body.classList.remove('no-scroll');
    };
  }, [selected]);

  function closePreview() {
    setSelected(null);
    if (triggerRef.current?.isConnected) triggerRef.current.focus({ preventScroll: true });
  }

  return <VideoContext.Provider value={{ reducedMotion, documentVisible, heroPaused, modalOpen: selected !== null, toggleHero: () => setHeroPaused(value => !value), openPreview: (template, trigger) => { triggerRef.current = trigger; setMediaError(false); setSelected(template); } }}>
    {children}
    <dialog ref={dialogRef} id="preview-dialog" aria-labelledby="preview-title" onClose={closePreview} onClick={event => {
      if (event.target !== event.currentTarget) return;
      const rect = event.currentTarget.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) event.currentTarget.close();
    }}>
      {selected && <>
        <div className="dialog-top"><h2><Link id="preview-detail" href={`/overlays/${selected.slug}/`}><span id="preview-title">{selected.name}</span></Link></h2><button className="icon-button" data-close aria-label="Vorschau schließen" onClick={() => dialogRef.current?.close()}>×</button></div>
        <video ref={videoRef} id="preview-video" src={selected.video ?? undefined} poster={selected.image} aria-label={`Originalvideo: ${selected.name}`} controls muted loop playsInline preload="none" onError={() => setMediaError(true)}/>
        {mediaError && <p className="media-error" role="status">Das Video kann hier nicht abgespielt werden. Das Vorschaubild und der Link zu ChatStyle stehen weiterhin zur Verfügung.</p>}
        <div className="dialog-bottom"><ChatStyleLink id="preview-shop" className="button" href={selected.shopUrl}>Auf <ChatStyleLogo/> ansehen</ChatStyleLink></div>
      </>}
    </dialog>
  </VideoContext.Provider>;
}

export function HeroMotionToggle() {
  const { heroPaused, toggleHero } = useVideoState();
  return <button className="text-button motion-toggle" id="hero-motion" aria-pressed={heroPaused} onClick={toggleHero}><span aria-hidden="true">{heroPaused ? '▶' : 'Ⅱ'}</span> Videos {heroPaused ? 'abspielen' : 'pausieren'}</button>;
}
