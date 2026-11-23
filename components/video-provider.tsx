'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

type VideoState = {
  reducedMotion: boolean;
  documentVisible: boolean;
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

  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const syncMotion = () => setReducedMotion(media.matches);
    const syncVisibility = () => setDocumentVisible(!document.hidden);
    syncMotion(); syncVisibility();
    media.addEventListener('change', syncMotion);
    document.addEventListener('visibilitychange', syncVisibility);
    return () => { media.removeEventListener('change', syncMotion); document.removeEventListener('visibilitychange', syncVisibility); };
  }, []);

  return <VideoContext.Provider value={{ reducedMotion, documentVisible }}>
    {children}
  </VideoContext.Provider>;
}

