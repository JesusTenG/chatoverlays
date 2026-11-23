export const guidesPath = '/guides/';
export const guideSlugs = ['add-chat-overlay-obs', 'chat-overlay-skins', 'cute-cozy-chat-overlays', 'retro-pixel-chat-overlays', 'readable-chat-overlay', 'streamlabs-chat-overlay', 'obs-chat-not-showing', 'transparent-chat-overlay', 'free-twitch-chat-overlays', 'youtube-chat-overlay-obs', 'animated-chat-overlays', 'just-chatting-overlay', 'vertical-chat-overlay', 'obs-stream-scenes', 'viewer-chat-bubbles', 'chat-overlay-before-after', 'chatstyle-setup', 'customize-chatstyle'];
export const guideGroups = [
  { id: 'setup', label: 'setupGroup', slugs: ['chatstyle-setup', 'add-chat-overlay-obs', 'streamlabs-chat-overlay', 'youtube-chat-overlay-obs', 'obs-chat-not-showing', 'transparent-chat-overlay'] },
  { id: 'styles', label: 'styleGroup', slugs: ['chat-overlay-before-after', 'customize-chatstyle', 'free-twitch-chat-overlays', 'animated-chat-overlays', 'cute-cozy-chat-overlays', 'retro-pixel-chat-overlays', 'readable-chat-overlay'] },
  { id: 'scenes', label: 'sceneGroup', slugs: ['obs-stream-scenes', 'just-chatting-overlay', 'vertical-chat-overlay', 'viewer-chat-bubbles', 'chat-overlay-skins'] },
];
export const articlePath = slug => `${guidesPath}${slug}/`;
