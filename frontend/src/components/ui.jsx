import { useRef } from "react";
import treeImg from "./algoquest_tree-final.png";
import playerImg from "./player_character_algoquest.png";

/* ═══════════════════════════════════════════════
   PLAYER SPRITE — 8×12 pixel art farmer
═══════════════════════════════════════════════ */
const SPRITE = [
  [0,0,6,6,6,6,0,0],
  [0,6,7,7,7,7,6,0],
  [6,7,7,7,7,7,7,6],
  [0,0,1,1,1,1,0,0],
  [0,1,2,1,1,2,1,0],
  [0,1,1,3,1,1,1,0],
  [0,4,4,4,4,4,4,0],
  [4,4,1,4,4,1,4,4],
  [0,4,4,4,4,4,4,0],
  [0,5,5,0,0,5,5,0],
  [0,5,5,0,0,5,5,0],
  [0,8,8,0,0,8,8,0],
];
export const SPRITE_C = ['transparent','#ffcc80','#2d2d2d','#5d4037','#4caf50','#8d6e63','#ffd700','#ffb300','#4e342e'];

export function FarmerSprite({ sz = 3, walk = false, flip = false }) {
  return (
    <div className="pixel-art" style={{ display:'inline-block', lineHeight:0, transform: flip ? 'scaleX(-1)' : 'scaleX(1)', transition:'transform .2s' }}>
      {SPRITE.map((row, i) => (
        <div key={i} style={{ display:'flex' }}>
          {row.map((c, j) => (
            <div key={j} style={{ width:sz*4, height:sz*4, background:SPRITE_C[c] }} />
          ))}
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   STAR BACKGROUND
═══════════════════════════════════════════════ */
export function StarBg() {
  const stars = useRef(
    Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      dur: 1.5 + Math.random() * 3,
      delay: Math.random() * 3,
      size: Math.random() < 0.2 ? 5 : 3,
    }))
  );
  return (
    <div style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:0, overflow:'hidden' }}>
      {stars.current.map(s => (
        <div key={s.id} style={{
          position:'absolute', left:`${s.x}%`, top:`${s.y}%`,
          width:s.size, height:s.size, background:'#fff9c4', borderRadius:'50%',
          animation:`twinkle ${s.dur}s ease-in-out infinite ${s.delay}s`,
        }} />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   REUSABLE UI COMPONENTS
═══════════════════════════════════════════════ */
export function WoodPanel({ children, style, className = '' }) {
  return <div className={`wood-panel ${className}`} style={style}>{children}</div>;
}
export function Parchment({ children, style, className = '' }) {
  return <div className={`parchment ${className}`} style={style}>{children}</div>;
}
export function PxBtn({ children, onClick, variant = 'brn', disabled, size, style }) {
  return (
    <button
      className={`px-btn px-btn-${variant}${size ? ` px-btn-${size}` : ''}`}
      onClick={onClick} disabled={disabled} style={style}
    >{children}</button>
  );
}
export function PxInput({ value, onChange, placeholder, type = 'text' }) {
  return (
    <input className="px-input" type={type} value={value}
      onChange={e => onChange(e.target.value)} placeholder={placeholder} />
  );
}
export function ProgBar({ value, max }) {
  return (
    <div className="prog-bar">
      <div className="prog-fill" style={{ width:`${Math.min(100,(value/max)*100)}%` }} />
    </div>
  );
}
export function Divider() { return <div className="divider" />; }

export function FeedbackBanner({ msg, type }) {
  if (!msg) return null;
  const colors = { success:'#2e7d32', error:'#b71c1c', info:'#1565c0', warn:'#e65100' };
  return (
    <div style={{
      padding:'10px 16px', border:`3px solid ${colors[type] || colors.info}`,
      background: type === 'success' ? 'rgba(46,125,50,.2)' : type === 'error' ? 'rgba(183,28,28,.2)' : 'rgba(21,101,192,.2)',
      borderRadius:2, fontSize:20, fontFamily:"'VT323',monospace",
      color: type === 'success' ? '#a5d6a7' : type === 'error' ? '#ef9a9a' : '#90caf9',
      animation: type === 'error' ? 'shake .4s ease-in-out' : 'slideIn .3s ease-out',
      marginTop:8,
    }}>
      {type === 'success' ? '✅ ' : type === 'error' ? '❌ ' : 'ℹ️ '}{msg}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   TREE LOGO — replaces pixel farmer on non-game screens
═══════════════════════════════════════════════ */
export function TreeLogo({ size = 80, style }) {
  const src = typeof treeImg === 'object' ? treeImg.src : treeImg;
  return (
    <img
      src={src}
      alt="AlgoQuest"
      className="pixel-art"
      style={{ width: size, height: size, objectFit: 'contain', imageRendering: 'pixelated', ...style }}
    />
  );
}
/* ═══════════════════════════════════════════════
   PLAYER CHARACTER — used in games
═══════════════════════════════════════════════ */
export function PlayerCharacter({ size = 80, flip = false, style }) {
  const src = typeof playerImg === 'object' ? playerImg.src : playerImg;
  return (
    <img
      src={src}
      alt="Player"
      className="pixel-art"
      style={{
        width: size, height: size, objectFit: 'contain', 
        imageRendering: 'pixelated',
        transform: flip ? 'scaleX(-1)' : 'scaleX(1)',
        transition: 'transform .2s',
        ...style
      }}
    />
  );
}
