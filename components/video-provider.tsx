'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { PauseIcon, PlayIcon } from './icons';

type VideoState = {
  reducedMotion: boolean;
  documentVisible: boolean;
  heroPaused: boolean;
  toggleHero: () => void;
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

  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const syncMotion = () => { setReducedMotion(media.matches); setHeroPaused(media.matches); };
    const syncVisibility = () => setDocumentVisible(!document.hidden);
    syncMotion(); syncVisibility();
    media.addEventListener('change', syncMotion);
    document.addEventListener('visibilitychange', syncVisibility);
    return () => { media.removeEventListener('change', syncMotion); document.removeEventListener('visibilitychange', syncVisibility); };
  }, []);

  return <VideoContext.Provider value={{ reducedMotion, documentVisible, heroPaused, toggleHero: () => setHeroPaused(value => !value) }}>
    {children}
  </VideoContext.Provider>;
}

export function HeroMotionToggle() {
  const { heroPaused, toggleHero } = useVideoState();
  return <button className="text-button motion-toggle" id="hero-motion" aria-pressed={heroPaused} onClick={toggleHero}>{heroPaused ? <PlayIcon/> : <PauseIcon/>}<span>Vorschauen {heroPaused ? 'abspielen' : 'pausieren'}</span></button>;
}
