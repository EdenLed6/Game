/* global React */
const I = {};
const sw = (size, props) => ({ width:size, height:size, viewBox:"0 0 24 24", fill:"none", stroke:"currentColor", strokeWidth:2, strokeLinecap:"round", strokeLinejoin:"round", ...props });

// ── Repo's own nav icons (Material-style, redrawn from web/assets/icons/) ──
I.Home = ({size=22}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M10,20v-6h4v6h5v-8h3L12,3 2,12h3v8z"/></svg>;
I.Profile = ({size=22}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M12,12c2.21,0 4,-1.79 4,-4s-1.79,-4 -4,-4 -4,1.79 -4,4 1.79,4 4,4zM12,14c-2.67,0 -8,1.34 -8,4v2h16v-2c0,-2.66 -5.33,-4 -8,-4z"/></svg>;
I.Media = ({size=22}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M12,3c-4.97,0-9,4.03-9,9v7c0,1.1 0.9,2 2,2h1v-8H4v-1c0-4.42 3.58-8 8-8s8,3.58 8,8v1h-2v8h2c1.1,0 2-0.9 2-2v-7c0-4.97-4.03-9-9-9z"/></svg>;
// Volume icon — from repo
I.Speaker = ({size=20}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M3,9v6h4l5,5V4L7,9H3zm13.5,3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-0.73 2.5-2.25 2.5-4.02z"/><path d="M14,3.23v2.06c2.89,0.86 5,3.54 5,6.71s-2.11,5.85-5,6.71v2.06c4.01-0.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>;
I.Mic = ({size=20}) => <svg {...sw(size)}><rect x="9" y="3" width="6" height="12" rx="3" fill="currentColor"/><path d="M5 11a7 7 0 0 0 14 0"/><path d="M12 18v3"/></svg>;
// Fire — from repo
I.Flame = ({size=18}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M13.5,0.67s0.74,2.65 0.74,4.8c0,2.06-1.35,3.73-3.41,3.73-2.07,0-3.63-1.67-3.63-3.73l0.03-0.36C5.21,7.51 4,10.62 4,14c0,4.42 3.58,8 8,8s8-3.58 8-8C20,8.61 17.41,3.8 13.5,0.67zM11.71,19c-1.78,0-3.22-1.4-3.22-3.14,0-1.62 1.05-2.76 2.81-3.12,1.77-0.36 3.6-1.21 4.62-2.58,0.39,1.29 0.59,2.65 0.59,4.04,0,2.65-2.15,4.8-4.8,4.8z"/></svg>;
// Star — from repo
I.Star = ({size=16, fill="currentColor"}) => <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}><path d="M12,17.27L18.18,21l-1.64-7.03L22,9.24l-7.19-0.61L12,2 9.19,8.63 2,9.24l5.46,4.73L5.82,21z"/></svg>;
// Heart — from repo
I.Heart = ({size=16}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M12,21.35l-1.45-1.32C5.4,15.36 2,12.28 2,8.5 2,5.42 4.42,3 7.5,3c1.74,0 3.41,0.81 4.5,2.09C13.09,3.81 14.76,3 16.5,3 19.58,3 22,5.42 22,8.5c0,3.78-3.4,6.86-8.55,11.54L12,21.35z"/></svg>;
I.ChevR = ({size=18}) => <svg {...sw(size,{strokeWidth:2.5})}><path d="M9 6l6 6-6 6"/></svg>;
I.ChevL = ({size=18}) => <svg {...sw(size,{strokeWidth:2.5})}><path d="M15 6l-6 6 6 6"/></svg>;
I.Close = ({size=20}) => <svg {...sw(size)}><path d="M6 6l12 12M18 6l-12 12"/></svg>;
// Lock — from repo
I.Lock = ({size=18}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M18,8h-1V6c0,-2.76 -2.24,-5 -5,-5S7,3.24 7,6v2H6c-1.1,0 -2,0.9 -2,2v10c0,1.1 0.9,2 2,2h12c1.1,0 2,-0.9 2,-2V10c0,-1.1 -0.9,-2 -2,-2zM12,17c-1.1,0 -2,-0.9 -2,-2s0.9,-2 2,-2 2,0.9 2,2 -0.9,2 -2,2zM15.1,8H8.9V6c0,-1.71 1.39,-3.1 3.1,-3.1 1.71,0 3.1,1.39 3.1,3.1V8z"/></svg>;
I.Check = ({size=18}) => <svg {...sw(size,{strokeWidth:3})}><path d="M5 12l5 5L20 7"/></svg>;
// Trophy — from repo
I.Trophy = ({size=20}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M19,5h-2V3H7v2H5C3.9,5 3,5.9 3,7v1c0,2.55 1.92,4.63 4.39,4.94,0.63,1.5 1.98,2.63 3.61,2.96V18H9v2h6v-2h-2v-2.1c1.63-0.33 2.98-1.46 3.61-2.96C19.08,12.63 21,10.55 21,8V7C21,5.9 20.1,5 19,5zM5,8V7h2v3.82C5.84,10.4 5,9.3 5,8zM12,14c-1.65,0-3-1.35-3-3V5h6v6C15,12.65 13.65,14 12,14zM19,8c0,1.3-0.84,2.4-2,2.82V7h2V8z"/></svg>;
I.Settings = ({size=20}) => <svg {...sw(size)}><circle cx="12" cy="12" r="3"/><path d="M12 1v3M12 20v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M1 12h3M20 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/></svg>;
I.Search = ({size=18}) => <svg {...sw(size)}><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>;
I.Book = ({size=20}) => <svg {...sw(size)}><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M19 19v2H6a2 2 0 0 1-2-2"/></svg>;
I.Bolt = ({size=16}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h7l-1 8 11-14h-7z"/></svg>;
I.Sparkle = ({size=18}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l1.8 5.4L19 9l-5.2 1.6L12 16l-1.8-5.4L5 9l5.2-1.6z"/></svg>;
I.Refresh = ({size=18}) => <svg {...sw(size)}><path d="M3 12a9 9 0 0 1 15-6.7L21 8M21 4v4h-4M21 12a9 9 0 0 1-15 6.7L3 16M3 20v-4h4"/></svg>;
I.Pause = ({size=18}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>;
I.Play = ({size=18}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>;
I.Headphones = ({size=20}) => <svg {...sw(size)}><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M3 19a2 2 0 0 0 2 2h2v-7H5a2 2 0 0 0-2 2zM21 19a2 2 0 0 1-2 2h-2v-7h2a2 2 0 0 1 2 2z" fill="currentColor"/></svg>;
I.FileText = ({size=20}) => <svg {...sw(size)}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>;
I.MusicNote = ({size=20}) => <svg {...sw(size)}><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3" fill="currentColor"/><circle cx="18" cy="16" r="3" fill="currentColor"/></svg>;
I.Torii = ({size=22}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M2 4l1 2c4 1 14 1 18 0l1-2H2zM3 7v3l3 .3V19h2V10.5h8V19h2V10.3l3-.3V7c-4 1-14 1-18 0z"/></svg>;
I.Sakura = ({size=18}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="6" r="3"/><circle cx="6" cy="10" r="3"/><circle cx="18" cy="10" r="3"/><circle cx="9" cy="17" r="3"/><circle cx="15" cy="17" r="3"/><circle cx="12" cy="12" r="2" fill="rgba(255,255,255,0.6)"/></svg>;
// Completed badge — gold circle + check
I.Badge = ({size=22}) => <svg width={size} height={size} viewBox="0 0 32 32"><path fill="currentColor" d="M16,2C8.27,2 2,8.27 2,16S8.27,30 16,30 30,23.73 30,16 23.73,2 16,2z"/><path fill="#fff" d="M13.5,21.5L8.5,16.5 10.2,14.8 13.5,18.1 21.8,9.8 23.5,11.5z"/></svg>;

window.I = I;
