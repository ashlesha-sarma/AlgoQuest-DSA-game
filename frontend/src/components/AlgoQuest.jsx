import { useState, useEffect, useRef, useCallback } from "react";
import { api, clearSession, getStoredToken, saveSession } from "../lib/api";

/* ═══════════════════════════════════════════════════════════════════════
   ALGOQUEST — Gamified DSA Learning Platform
   A Stardew Valley–inspired pixel art game for learning algorithms
═══════════════════════════════════════════════════════════════════════ */

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg:        #1a0e05;
  --brown-d:   #3e2723;
  --brown-m:   #5d4037;
  --brown-l:   #8d6e63;
  --brown-p:   #d7ccc8;
  --cream:     #fff9c4;
  --cream-l:   #fffde7;
  --green-d:   #2e7d32;
  --green-m:   #4caf50;
  --green-l:   #81c784;
  --gold:      #ffd700;
  --gold-d:    #f9a825;
  --red:       #e53935;
  --blue:      #1976d2;
  --orange:    #ff9800;
  --purple:    #7b1fa2;
}

html, body {
  font-family: 'VT323', monospace;
  background: var(--bg);
  color: var(--cream);
  min-height: 100vh;
  overflow-x: hidden;
}

.pixel-art {
  image-rendering: pixelated;
  image-rendering: crisp-edges;
}

/* ── KEYFRAMES ── */
@keyframes float    { 0%,100%{transform:translateY(0)}      50%{transform:translateY(-10px)} }
@keyframes shake    { 0%,100%{transform:translateX(0)}       20%{transform:translateX(-10px)} 60%{transform:translateX(10px)} }
@keyframes glow     { 0%,100%{box-shadow:0 0 6px var(--gold)} 50%{box-shadow:0 0 28px var(--gold),0 0 55px rgba(255,215,0,.45)} }
@keyframes xpPop    { 0%{opacity:1;transform:translateY(0) scale(1)} 100%{opacity:0;transform:translateY(-90px) scale(1.8)} }
@keyframes fall     { from{transform:translateY(-60px);opacity:0} to{transform:translateY(0);opacity:1} }
@keyframes pulse    { 0%,100%{transform:scale(1)} 50%{transform:scale(1.10)} }
@keyframes twinkle  { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.15;transform:scale(.6)} }
@keyframes bounceIn { 0%{transform:scale(0);opacity:0} 60%{transform:scale(1.25)} 100%{transform:scale(1);opacity:1} }
@keyframes swap     { 0%{transform:translateY(0)} 40%{transform:translateY(-44px)} 80%{transform:translateY(0)} }
@keyframes walkBob  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
@keyframes scrnShk  { 0%,100%{transform:translate(0)} 25%{transform:translate(-5px,-3px)} 75%{transform:translate(5px,3px)} }
@keyframes appear   { from{transform:scale(0) rotate(-180deg);opacity:0} to{transform:scale(1) rotate(0deg);opacity:1} }
@keyframes slideIn  { from{transform:translateX(-40px);opacity:0} to{transform:translateX(0);opacity:1} }
@keyframes nodeFall { from{transform:translateY(-40px);opacity:0} to{transform:translateY(0);opacity:1} }
@keyframes celebrate{ 0%{transform:scale(1) rotate(0deg)} 25%{transform:scale(1.2) rotate(5deg)} 50%{transform:scale(1.3) rotate(-5deg)} 75%{transform:scale(1.1) rotate(3deg)} 100%{transform:scale(1) rotate(0deg)} }
@keyframes windowGl { 0%,100%{background:rgba(33,150,243,.2)} 50%{background:rgba(33,150,243,.5)} }
@keyframes arrowRev { 0%{transform:scaleX(1)} 50%{transform:scaleX(0)} 100%{transform:scaleX(-1)} }

.anim-float     { animation: float    2.5s ease-in-out infinite; }
.anim-shake     { animation: shake    0.4s ease-in-out; }
.anim-glow      { animation: glow     1.2s ease-in-out infinite; }
.anim-pulse     { animation: pulse    0.8s ease-in-out infinite; }
.anim-walk      { animation: walkBob  0.4s ease-in-out infinite; }
.anim-bounce    { animation: bounceIn 0.55s cubic-bezier(.36,.07,.19,.97) both; }
.anim-scrnshk   { animation: scrnShk  0.3s ease-in-out; }
.anim-celebrate { animation: celebrate 0.8s ease-in-out; }
.anim-appear    { animation: appear   0.5s ease-out both; }
.anim-slide     { animation: slideIn  0.4s ease-out both; }
.anim-fall      { animation: fall     0.4s ease-out both; }
.anim-swap      { animation: swap     0.55s ease-in-out both; }

/* ── PANELS ── */
.wood-panel {
  background: linear-gradient(155deg, #8d6e63 0%, #795548 45%, #8d6e63 100%);
  border: 4px solid #4e342e;
  border-radius: 3px;
  box-shadow:
    inset 0 2px 0 #a1887f, inset 0 -2px 0 #4e342e,
    inset 2px 0 0 #a1887f, inset -2px 0 0 #4e342e,
    0 6px 0 #3e2723, 6px 6px 0 rgba(0,0,0,.5);
  padding: 16px;
}

.parchment {
  background: linear-gradient(135deg, #fff9c4, #fffde7 35%, #fff8e1 70%, #fff9c4);
  border: 4px solid #8d6e63;
  border-radius: 3px;
  box-shadow: inset 0 0 35px rgba(93,64,37,.18), 0 4px 0 #5d4037, 4px 4px 0 #3e2723;
  color: #3e2723;
  padding: 16px;
}

/* ── PIXEL BUTTONS ── */
.px-btn {
  font-family:'VT323',monospace; font-size:20px; letter-spacing:1px;
  padding:8px 18px; border:3px solid; cursor:pointer;
  transition:transform .08s, box-shadow .08s;
  display:inline-flex; align-items:center; gap:6px;
  text-transform:uppercase; border-radius:2px; user-select:none;
  position:relative; white-space:nowrap;
}
.px-btn:hover:not(:disabled){ transform:translate(-1px,-1px); }
.px-btn:active:not(:disabled){ transform:translate(2px,2px); box-shadow:none!important; }
.px-btn:disabled{ opacity:.45; cursor:not-allowed; }

.px-btn-brn  { background:#8d6e63; color:var(--cream); border-color:#4e342e; box-shadow:3px 3px 0 #3e2723; }
.px-btn-grn  { background:#4caf50; color:#fff;         border-color:#2e7d32; box-shadow:3px 3px 0 #1b5e20; }
.px-btn-red  { background:#e53935; color:#fff;         border-color:#b71c1c; box-shadow:3px 3px 0 #7f0000; }
.px-btn-blu  { background:#1976d2; color:#fff;         border-color:#0d47a1; box-shadow:3px 3px 0 #002171; }
.px-btn-gld  { background:#f9a825; color:#3e2723;      border-color:#f57f17; box-shadow:3px 3px 0 #e65100; }
.px-btn-pur  { background:#7b1fa2; color:#fff;         border-color:#4a148c; box-shadow:3px 3px 0 #12005e; }
.px-btn-org  { background:#ff9800; color:#fff;         border-color:#e65100; box-shadow:3px 3px 0 #bf360c; }
.px-btn-sm   { font-size:16px; padding:5px 12px; }
.px-btn-lg   { font-size:26px; padding:12px 28px; }

/* ── INPUT ── */
.px-input {
  font-family:'VT323',monospace; font-size:22px;
  padding:9px 13px; border:3px solid #8d6e63;
  background:var(--cream); color:#3e2723; outline:none; border-radius:2px; width:100%;
}
.px-input:focus{ border-color:#4caf50; }

/* ── TILES ── */
.tile {
  width:62px; height:62px;
  display:flex; align-items:center; justify-content:center;
  font-size:24px; font-family:'VT323',monospace;
  border:3px solid #5d4037; background:#d7ccc8; color:#3e2723;
  transition:background .2s, box-shadow .2s, transform .15s;
  cursor:pointer; border-radius:2px; position:relative; user-select:none;
  box-shadow:2px 2px 0 #5d4037;
}
.tile:hover         { background:#bcaaa4; transform:scale(1.07); }
.tile.comparing     { background:var(--cream); border-color:var(--gold); box-shadow:0 0 14px rgba(255,215,0,.8); }
.tile.sorted        { background:#4caf50; color:#fff; border-color:#2e7d32; box-shadow:2px 2px 0 #1b5e20; }
.tile.active-win    { background:rgba(33,150,243,.28); border-color:#2196f3; box-shadow:0 0 12px rgba(33,150,243,.6); animation:windowGl 1s infinite; }
.tile.dup-win       { background:rgba(229,57,53,.28); border-color:#e53935; box-shadow:0 0 12px rgba(229,57,53,.6); }
.tile.swapping      { animation:swap .55s ease-in-out; }
.tile.locked-win    { background:rgba(76,175,80,.3); border-color:#4caf50; }

/* ── NODES (BFS) ── */
.node {
  width:58px; height:58px; border-radius:50%;
  display:flex; align-items:center; justify-content:center;
  font-size:22px; font-family:'VT323',monospace;
  border:3px solid #5d4037; background:#d7ccc8; color:#3e2723;
  cursor:pointer; transition:all .3s; position:absolute; user-select:none;
  box-shadow:3px 3px 0 #5d4037;
}
.node.visited    { background:#4caf50; color:#fff; border-color:#2e7d32; box-shadow:0 0 14px rgba(76,175,80,.8); cursor:default; }
.node.in-queue   { background:var(--cream); border-color:var(--gold); box-shadow:0 0 14px rgba(255,215,0,.8); }
.node.current    { background:#ff9800; color:#fff; border-color:#e65100; box-shadow:0 0 18px rgba(255,152,0,.9); animation:pulse .6s infinite; cursor:default; }
.node.clickable  { border-color:#4caf50; box-shadow:0 0 12px rgba(76,175,80,.6); animation:pulse .8s infinite; }
.node:hover.clickable { transform:scale(1.15); }

/* ── LINKED LIST ── */
.ll-box {
  width:62px; height:62px; display:flex; align-items:center; justify-content:center;
  font-size:24px; font-family:'VT323',monospace;
  border:3px solid #5d4037; background:#d7ccc8; color:#3e2723;
  border-radius:3px; transition:all .35s; position:relative; user-select:none;
  box-shadow:2px 2px 0 #5d4037;
}
.ll-box.prev-ptr { background:#7b1fa2; color:#fff; border-color:#4a148c; box-shadow:0 0 12px rgba(123,31,162,.7); }
.ll-box.curr-ptr { background:#ff9800; color:#fff; border-color:#e65100; box-shadow:0 0 12px rgba(255,152,0,.7); }
.ll-box.next-ptr { background:#1976d2; color:#fff; border-color:#0d47a1; box-shadow:0 0 12px rgba(25,118,210,.7); }
.ll-box.done     { background:#4caf50; color:#fff; border-color:#2e7d32; box-shadow:0 0 12px rgba(76,175,80,.7); }

/* ── STACK SLOT ── */
.stk-slot {
  width:72px; height:52px; display:flex; align-items:center; justify-content:center;
  font-size:30px; font-family:'VT323',monospace;
  border:3px solid #5d4037; background:#d7ccc8; color:#3e2723;
  border-radius:2px; transition:all .3s; box-shadow:2px 2px 0 #5d4037;
}
.stk-slot.match    { background:#4caf50; color:#fff; border-color:#2e7d32; }
.stk-slot.mismatch { background:#e53935; color:#fff; border-color:#b71c1c; }

/* ── FALLING CHAR ── */
.falling-char {
  font-size:48px; font-family:'VT323',monospace;
  color:var(--cream); text-shadow:2px 2px 0 #3e2723;
  animation:fall .5s ease-out both;
  user-select:none;
}

/* ── PROGRESS ── */
.prog-bar  { height:14px; background:#3e2723; border:2px solid #5d4037; border-radius:2px; overflow:hidden; }
.prog-fill { height:100%; background:linear-gradient(90deg,#4caf50,#8bc34a); transition:width .6s ease; }

/* ── XP POPUP ── */
.xp-popup {
  position:fixed; font-family:'VT323',monospace; font-size:40px;
  color:var(--gold); text-shadow:2px 2px 0 #e65100,4px 4px 0 rgba(0,0,0,.4);
  pointer-events:none; animation:xpPop 1.6s ease-out forwards; z-index:9999; white-space:nowrap;
}

/* ── MISC ── */
.divider       { height:4px; background:repeating-linear-gradient(90deg,#5d4037 0,#5d4037 8px,#3e2723 8px,#3e2723 16px); margin:10px 0; }
.badge-easy    { display:inline-block;padding:2px 8px;border:2px solid #1b5e20;background:#2e7d32;color:#c8e6c9;font-size:15px;border-radius:2px; }
.badge-medium  { display:inline-block;padding:2px 8px;border:2px solid #bf360c;background:#e65100;color:var(--cream);font-size:15px;border-radius:2px; }
.badge-hard    { display:inline-block;padding:2px 8px;border:2px solid #7f0000;background:#b71c1c;color:#ffcdd2;font-size:15px;border-radius:2px; }
.badge-done    { display:inline-block;padding:2px 8px;border:2px solid #2e7d32;background:#4caf50;color:#fff;font-size:15px;border-radius:2px; }

::-webkit-scrollbar        { width:8px; }
::-webkit-scrollbar-track  { background:#3e2723; }
::-webkit-scrollbar-thumb  { background:#8d6e63; border-radius:2px; }
`;

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
const SPRITE_C = ['transparent','#ffcc80','#2d2d2d','#5d4037','#4caf50','#8d6e63','#ffd700','#ffb300','#4e342e'];

function FarmerSprite({ sz = 3, walk = false, flip = false }) {
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
function StarBg() {
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
function WoodPanel({ children, style, className = '' }) {
  return <div className={`wood-panel ${className}`} style={style}>{children}</div>;
}
function Parchment({ children, style, className = '' }) {
  return <div className={`parchment ${className}`} style={style}>{children}</div>;
}
function PxBtn({ children, onClick, variant = 'brn', disabled, size, style }) {
  return (
    <button
      className={`px-btn px-btn-${variant}${size ? ` px-btn-${size}` : ''}`}
      onClick={onClick} disabled={disabled} style={style}
    >{children}</button>
  );
}
function PxInput({ value, onChange, placeholder, type = 'text' }) {
  return (
    <input className="px-input" type={type} value={value}
      onChange={e => onChange(e.target.value)} placeholder={placeholder} />
  );
}
function ProgBar({ value, max }) {
  return (
    <div className="prog-bar">
      <div className="prog-fill" style={{ width:`${Math.min(100,(value/max)*100)}%` }} />
    </div>
  );
}
function Divider() { return <div className="divider" />; }

function FeedbackBanner({ msg, type }) {
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
   GAME DATA — WORLDS + PROBLEMS
═══════════════════════════════════════════════ */
const WORLDS = [
  {
    id:'arrays', name:'Arrays Kingdom', icon:'🏰', color:'#2e7d32', accent:'#4caf50',
    desc:'Master sorting and windowing in the fertile fields of Array-ia.',
    problems:[
      { id:'bubble', title:'Bubble Sort Path', type:'bubble', diff:'easy',  xp:10, desc:'Guide your farmer through the harvest path by sorting the crops!' },
      { id:'window', title:'Sliding Window Quest', type:'window', diff:'medium', xp:20, desc:'Expand and shrink the harvest window to collect the longest unique crop run!' },
    ],
  },
  {
    id:'pointers', name:'Pointer Forest', icon:'🌲', color:'#4e342e', accent:'#a1887f',
    desc:'Navigate tangled vines of linked nodes deep in the enchanted forest.',
    problems:[
      { id:'linked', title:'Reverse the River', type:'linked', diff:'medium', xp:20, desc:'Reverse the flow of the enchanted river — flip every pointer!' },
    ],
  },
  {
    id:'graphs', name:'Graph Dungeon', icon:'🗺️', color:'#0d47a1', accent:'#1976d2',
    desc:'Explore the labyrinthine dungeon using Breadth-First Search.',
    problems:[
      { id:'bfs', title:'BFS Labyrinth', type:'bfs', diff:'medium', xp:20, desc:'Visit every chamber in the correct BFS order to escape the dungeon!' },
    ],
  },
  {
    id:'stacks', name:'Stack Tower', icon:'🗼', color:'#7f0000', accent:'#e53935',
    desc:'Catch falling brackets and match them in the ancient Stack Tower.',
    problems:[
      { id:'parens', title:'Bracket Guardian', type:'parens', diff:'hard', xp:30, desc:'Push and pop brackets onto the magic stack — match every pair!' },
    ],
  },
];

function normalizeUser(user) {
  if (!user) return null;

  return {
    ...user,
    name: user.name || user.email?.split('@')[0] || 'Adventurer',
    completed: Array.isArray(user.completed) ? user.completed : [],
    xp: user.xp ?? 0,
    currentWorld: user.currentWorld ?? 1,
  };
}

/* ═══════════════════════════════════════════════
   GAME 1 — BUBBLE SORT
═══════════════════════════════════════════════ */
function BubbleSortGame({ onComplete, addXP }) {
  const INIT = [64, 34, 25, 12, 22, 11, 90];
  const [arr, setArr]           = useState([...INIT]);
  const [i, setI]               = useState(0);
  const [j, setJ]               = useState(0);
  const [sorted, setSorted]     = useState([]);
  const [done, setDone]         = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [swapCount, setSwapCount] = useState(0);
  const [swapping, setSwapping] = useState([]);
  const [playerPos, setPlayerPos] = useState(0);
  const [playerFlip, setPlayerFlip] = useState(false);
  const [shake, setShake]       = useState(false);
  const [steps, setSteps]       = useState(0);
  const n = arr.length;

  // Compute what the correct action is at (i, j)
  const shouldSwap = arr[j] > arr[j + 1];

  const endStep = (newArr, newJ, newI, newSorted) => {
    const nextJ = newJ + 1;
    const nextI = newI;
    if (nextJ >= n - 1 - newI) {
      const ns = [...newSorted, n - 1 - newI];
      setSorted(ns);
      if (newI + 1 >= n - 1) {
        setDone(true);
        addXP(10, 400, 300);
        setFeedback({ msg:'Array sorted! Outstanding work, farmer!', type:'success' });
      } else {
        setI(newI + 1); setJ(0); setPlayerPos(0);
        setFeedback({ msg:`Pass ${newI + 1} complete! Starting next sweep…`, type:'info' });
      }
    } else {
      setJ(nextJ); setPlayerPos(nextJ);
      setFeedback({ msg: shouldSwap ? 'Correct! Swapped!' : 'Correct! Moved on.', type:'success' });
    }
    setSteps(s => s + 1);
  };

  const doSwap = () => {
    if (done) return;
    if (!shouldSwap) {
      setShake(true); setTimeout(() => setShake(false), 400);
      setFeedback({ msg:`${arr[j]} < ${arr[j+1]} — no swap needed here!`, type:'error' });
      return;
    }
    const newArr = [...arr];
    [newArr[j], newArr[j+1]] = [newArr[j+1], newArr[j]];
    setSwapping([j, j+1]);
    setTimeout(() => {
      setArr(newArr); setSwapping([]);
      setPlayerFlip(f => !f);
      endStep(newArr, j, i, sorted);
    }, 550);
    setSwapCount(c => c + 1);
  };

  const doKeep = () => {
    if (done) return;
    if (shouldSwap) {
      setShake(true); setTimeout(() => setShake(false), 400);
      setFeedback({ msg:`${arr[j]} > ${arr[j+1]} — you must swap!`, type:'error' });
      return;
    }
    endStep(arr, j, i, sorted);
  };

  const reset = () => {
    setArr([...INIT]); setI(0); setJ(0); setSorted([]); setDone(false);
    setFeedback(null); setSwapCount(0); setSwapping([]); setPlayerPos(0); setSteps(0);
  };

  return (
    <div className={shake ? 'anim-scrnshk' : ''}>
      {/* Header */}
      <WoodPanel style={{ marginBottom:16 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:8 }}>
          <div>
            <div style={{ fontSize:24, color:SPRITE_C[6] }}>🌾 Bubble Sort Path</div>
            <div style={{ fontSize:16, color:'#d7ccc8' }}>Pass {i+1} of {n-1} · Comparing positions {j} & {j+1} · Swaps: {swapCount}</div>
          </div>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            <PxBtn variant="brn" size="sm" onClick={reset}>↺ Reset</PxBtn>
            {done && <PxBtn variant="grn" onClick={onComplete}>Next Level →</PxBtn>}
          </div>
        </div>
      </WoodPanel>

      {/* Algorithm Info */}
      <Parchment style={{ marginBottom:16 }}>
        <div style={{ fontSize:18, color:'#5d4037' }}>
          <strong>How it works:</strong> In each pass, compare adjacent tiles. If left &gt; right → SWAP. Repeat until sorted.
        </div>
        <div style={{ marginTop:8, display:'flex', gap:16, flexWrap:'wrap' }}>
          <span style={{ fontSize:16 }}>🟡 Comparing &nbsp; 🟢 Sorted &nbsp; 🔵 Player position</span>
        </div>
      </Parchment>

      {/* Player + Array */}
      <WoodPanel style={{ marginBottom:16 }}>
        {/* Player sprite */}
        <div style={{ display:'flex', alignItems:'flex-end', gap:4, marginBottom:12, overflowX:'auto', paddingBottom:4 }}>
          {arr.map((val, idx) => (
            <div key={idx} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
              {/* Player position indicator */}
              <div style={{ height:48, display:'flex', alignItems:'flex-end', justifyContent:'center' }}>
                {idx === j && !done && (
                  <div className="anim-walk">
                    <FarmerSprite sz={2} flip={playerFlip} />
                  </div>
                )}
              </div>
              {/* Tile */}
              <div
                className={`tile ${sorted.includes(idx) ? 'sorted' : ''} ${(idx===j||idx===j+1)&&!done ? 'comparing' : ''} ${swapping.includes(idx) ? 'swapping' : ''}`}
                style={{ fontSize:22, fontWeight:'bold' }}
              >
                {val}
              </div>
              {/* Index label */}
              <div style={{ fontSize:14, color:'#d7ccc8' }}>[{idx}]</div>
            </div>
          ))}
        </div>

        {/* Controls */}
        {!done && (
          <div style={{ display:'flex', gap:12, alignItems:'center', flexWrap:'wrap' }}>
            <div style={{ fontSize:20, color:SPRITE_C[6] }}>
              Compare: <strong style={{ color:'#fff9c4' }}>{arr[j]}</strong> vs <strong style={{ color:'#fff9c4' }}>{arr[j+1]}</strong>
            </div>
            <PxBtn variant="red" onClick={doSwap}>⇄ SWAP</PxBtn>
            <PxBtn variant="blu" onClick={doKeep}>→ KEEP</PxBtn>
          </div>
        )}
        {done && (
          <div style={{ fontSize:24, color:'#a5d6a7' }} className="anim-bounce">
            🎉 Array Fully Sorted in {steps} steps! +10 XP earned!
          </div>
        )}

        {/* Feedback */}
        {feedback && <FeedbackBanner msg={feedback.msg} type={feedback.type} />}
      </WoodPanel>

      {/* Pseudo-code panel */}
      <Parchment style={{ fontFamily:"'VT323',monospace", fontSize:16 }}>
        <div style={{ fontWeight:'bold', marginBottom:4, fontSize:18 }}>📜 Algorithm State</div>
        <pre style={{ color:'#3e2723', lineHeight:1.6 }}>
{`for i in range(n-1):          ← pass ${i+1}/${n-1}
  for j in range(n-1-i):      ← comparing j=${j}
    if arr[j] > arr[j+1]:
      swap(arr[j], arr[j+1])  ← your move!`}
        </pre>
      </Parchment>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   GAME 2 — SLIDING WINDOW
═══════════════════════════════════════════════ */
function SlidingWindowGame({ onComplete, addXP }) {
  const ARR = [2, 1, 5, 2, 3, 2, 1, 4];
  const ANSWER = 4; // longest = [1,5,2,3] or [2,3,2... wait no dupes] = [1,5,2,3] or [5,2,3,1] = length 4? Actually [2,1,5,2] has duplicate. Let me verify. [1,5,2,3] - no dups, length 4. [5,2,3,2] has dup. So max=4.
  // Actually recompute: positions 1-4: [1,5,2,3] all unique -> length 4. That's the answer.

  const [left, setLeft]   = useState(0);
  const [right, setRight] = useState(0);
  const [locked, setLocked]   = useState(false);
  const [best, setBest]       = useState(0);
  const [bestL, setBestL]     = useState(0);
  const [bestR, setBestR]     = useState(0);
  const [done, setDone]       = useState(false);
  const [feedback, setFeedback] = useState({ msg:'Expand the window to find the longest subarray with no duplicate values!', type:'info' });
  const [shake, setShake]     = useState(false);
  const [step, setStep]       = useState(0);

  const window_vals = ARR.slice(left, right + 1);
  const hasDup = new Set(window_vals).size < window_vals.length;
  const winLen = right - left + 1;

  const expandRight = () => {
    if (locked || right >= ARR.length - 1) return;
    const newR = right + 1;
    const newSlice = ARR.slice(left, newR + 1);
    const dup = new Set(newSlice).size < newSlice.length;
    setRight(newR); setStep(s => s + 1);
    if (dup) setFeedback({ msg:`Duplicate ${ARR[newR]} detected! Shrink from left.`, type:'warn' });
    else {
      const len = newR - left + 1;
      if (len > best) { setBest(len); setBestL(left); setBestR(newR); }
      setFeedback({ msg:`Window expanded → [${ARR.slice(left,newR+1).join(',')}] (length ${len})`, type:'success' });
    }
  };

  const shrinkLeft = () => {
    if (locked || left >= right) return;
    setLeft(l => l + 1); setStep(s => s + 1);
    const newL = left + 1;
    setFeedback({ msg:`Left shrunk → [${ARR.slice(newL,right+1).join(',')}]`, type:'info' });
  };

  const lockWindow = () => {
    if (hasDup) {
      setShake(true); setTimeout(() => setShake(false), 400);
      setFeedback({ msg:'Window has duplicates! Cannot lock.', type:'error' }); return;
    }
    if (winLen < ANSWER) {
      setFeedback({ msg:`Length ${winLen} — but the max is longer! Keep exploring.`, type:'warn' }); return;
    }
    setLocked(true); setDone(true);
    addXP(20, 400, 300);
    setFeedback({ msg:`🎉 Perfect! Longest unique window = ${winLen}! +20 XP!`, type:'success' });
  };

  const reset = () => {
    setLeft(0); setRight(0); setLocked(false); setBest(0); setDone(false); setStep(0);
    setFeedback({ msg:'Expand the window to find the longest subarray with no duplicate values!', type:'info' });
  };

  return (
    <div className={shake ? 'anim-scrnshk' : ''}>
      <WoodPanel style={{ marginBottom:16 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:8 }}>
          <div>
            <div style={{ fontSize:24, color:SPRITE_C[6] }}>🪟 Sliding Window Quest</div>
            <div style={{ fontSize:16, color:'#d7ccc8' }}>Steps: {step} · Best found: {best} · Target: ≥{ANSWER}</div>
          </div>
          <div style={{ display:'flex', gap:8 }}>
            <PxBtn variant="brn" size="sm" onClick={reset}>↺ Reset</PxBtn>
            {done && <PxBtn variant="grn" onClick={onComplete}>Next Level →</PxBtn>}
          </div>
        </div>
      </WoodPanel>

      <Parchment style={{ marginBottom:16 }}>
        <div style={{ fontSize:18, color:'#5d4037' }}>
          <strong>Goal:</strong> Find the longest subarray with <em>no duplicate</em> values.
          Use <strong>Expand →</strong> to grow right, <strong>← Shrink</strong> to move left pointer, then <strong>Lock</strong> when you find the max!
        </div>
      </Parchment>

      <WoodPanel style={{ marginBottom:16 }}>
        {/* Array display */}
        <div style={{ display:'flex', gap:4, overflowX:'auto', paddingBottom:8, marginBottom:12 }}>
          {ARR.map((val, idx) => {
            const inWin = idx >= left && idx <= right;
            const dup = inWin && window_vals.filter(v => v === val).length > 1;
            return (
              <div key={idx} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                {/* Window bracket indicators */}
                <div style={{ height:20, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, color:'#90caf9' }}>
                  {idx === left ? 'L' : idx === right ? 'R' : inWin ? '·' : ''}
                </div>
                <div className={`tile ${inWin ? (dup ? 'dup-win' : locked ? 'locked-win' : 'active-win') : ''}`}>
                  {val}
                </div>
                <div style={{ fontSize:14, color:'#d7ccc8' }}>[{idx}]</div>
              </div>
            );
          })}
        </div>

        {/* Window stats */}
        <div style={{ display:'flex', gap:16, flexWrap:'wrap', marginBottom:12 }}>
          <div className="parchment" style={{ padding:'8px 14px', fontSize:20 }}>
            Window: [{window_vals.join(', ')}]
          </div>
          <div className="parchment" style={{ padding:'8px 14px', fontSize:20 }}>
            Length: <strong>{winLen}</strong>
          </div>
          <div style={{
            padding:'8px 14px', fontSize:20,
            background: hasDup ? 'rgba(229,57,53,.2)' : 'rgba(76,175,80,.2)',
            border:`3px solid ${hasDup ? '#e53935' : '#4caf50'}`, borderRadius:2,
            color: hasDup ? '#ef9a9a' : '#a5d6a7',
          }}>
            {hasDup ? '⚠️ Has Duplicates' : '✅ All Unique'}
          </div>
        </div>

        {/* Controls */}
        {!done && (
          <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
            <PxBtn variant="blu" onClick={shrinkLeft} disabled={left >= right}>← Shrink Left</PxBtn>
            <PxBtn variant="org" onClick={expandRight} disabled={right >= ARR.length-1}>Expand Right →</PxBtn>
            <PxBtn variant="grn" onClick={lockWindow}>🔒 Lock Window</PxBtn>
          </div>
        )}

        {feedback && <FeedbackBanner msg={feedback.msg} type={feedback.type} />}
      </WoodPanel>

      {/* Best window tracker */}
      {best > 0 && (
        <Parchment>
          <div style={{ fontSize:18 }}>
            🏆 Best window so far: <strong>[{ARR.slice(bestL,bestR+1).join(', ')}]</strong> (length {best})
            {best >= ANSWER && <span style={{ color:'#2e7d32', marginLeft:8 }}>← This is the answer!</span>}
          </div>
        </Parchment>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   GAME 3 — REVERSE LINKED LIST
═══════════════════════════════════════════════ */
function LinkedListGame({ onComplete, addXP }) {
  // State of the linked list reversal algorithm
  // Initial: 1→2→3→4→5→null
  // We model step-by-step reversal with prev/curr/next
  const NODES = [1, 2, 3, 4, 5];
  const TOTAL_STEPS = NODES.length; // 5 steps to reverse

  const [step, setStep]         = useState(0); // 0..5
  const [prevIdx, setPrevIdx]   = useState(-1);  // -1 = null
  const [currIdx, setCurrIdx]   = useState(0);
  const [nextIdx, setNextIdx]   = useState(1);
  const [reversed, setReversed] = useState([]); // indices that have been reversed
  const [done, setDone]         = useState(false);
  const [feedback, setFeedback] = useState({ msg:'Click "Advance Step" to reverse one pointer at a time!', type:'info' });
  const [showChoice, setShowChoice] = useState(false);
  const [animKey, setAnimKey]   = useState(0);

  // After each step, user must choose where curr.next points
  const advance = () => {
    if (done || currIdx >= NODES.length) return;
    const newNext = currIdx + 1 < NODES.length ? currIdx + 1 : -1;

    // Ask user: "What should curr.next point to?"
    setShowChoice(true);
    setFeedback({ msg:`Step ${step+1}: curr = node ${NODES[currIdx]}. Choose where to point curr.next:`, type:'info' });
  };

  const choose = (choice) => {
    // Correct answer is always 'prev'
    if (choice === 'prev') {
      const newReversed = [...reversed, currIdx];
      setReversed(newReversed);
      const newPrev = currIdx;
      const newCurr = currIdx + 1;
      const newNext = currIdx + 2 < NODES.length ? currIdx + 2 : -1;
      setShowChoice(false); setAnimKey(k => k + 1);

      if (newCurr >= NODES.length) {
        setDone(true);
        addXP(20, 400, 300);
        setFeedback({ msg:'🎉 List fully reversed! 5→4→3→2→1→null! +20 XP!', type:'success' });
      } else {
        setPrevIdx(newPrev); setCurrIdx(newCurr); setNextIdx(newNext);
        setStep(s => s + 1);
        setFeedback({ msg:`✅ Correct! curr.next now points to prev (node ${NODES[newPrev]}).`, type:'success' });
      }
    } else {
      setFeedback({ msg:`❌ Wrong! curr.next should point to prev (the already-reversed part), not ${choice}.`, type:'error' });
    }
  };

  const reset = () => {
    setStep(0); setPrevIdx(-1); setCurrIdx(0); setNextIdx(1);
    setReversed([]); setDone(false); setShowChoice(false); setAnimKey(0);
    setFeedback({ msg:'Click "Advance Step" to reverse one pointer at a time!', type:'info' });
  };

  return (
    <div>
      <WoodPanel style={{ marginBottom:16 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:8 }}>
          <div>
            <div style={{ fontSize:24, color:SPRITE_C[6] }}>🌊 Reverse the River</div>
            <div style={{ fontSize:16, color:'#d7ccc8' }}>Step {step}/{TOTAL_STEPS} · Reverse each pointer one at a time</div>
          </div>
          <div style={{ display:'flex', gap:8 }}>
            <PxBtn variant="brn" size="sm" onClick={reset}>↺ Reset</PxBtn>
            {done && <PxBtn variant="grn" onClick={onComplete}>Next Level →</PxBtn>}
          </div>
        </div>
      </WoodPanel>

      <Parchment style={{ marginBottom:16 }}>
        <div style={{ fontSize:18, color:'#5d4037' }}>
          <strong>Algorithm:</strong> Use three pointers: <span style={{color:'#7b1fa2'}}>prev</span>, <span style={{color:'#e65100'}}>curr</span>, <span style={{color:'#1565c0'}}>next</span>.
          At each step, point curr.next → prev, then advance all three forward.
        </div>
      </Parchment>

      <WoodPanel style={{ marginBottom:16 }}>
        {/* Legend */}
        <div style={{ display:'flex', gap:16, marginBottom:12, flexWrap:'wrap', fontSize:18 }}>
          <span style={{color:'#ce93d8'}}>■ prev (null/{NODES[prevIdx]??'null'})</span>
          <span style={{color:'#ffcc80'}}>■ curr ({NODES[currIdx]??'done'})</span>
          <span style={{color:'#90caf9'}}>■ next ({nextIdx>=0?NODES[nextIdx]:'null'})</span>
          <span style={{color:'#a5d6a7'}}>■ reversed</span>
        </div>

        {/* Linked list visual */}
        <div style={{ display:'flex', alignItems:'center', gap:0, overflowX:'auto', paddingBottom:8, marginBottom:12 }}>
          {NODES.map((val, idx) => {
            const isRev = reversed.includes(idx);
            const isPrev = idx === prevIdx;
            const isCurr = idx === currIdx && !done;
            const isNext = idx === nextIdx && !done;
            return (
              <div key={`${animKey}-${idx}`} style={{ display:'flex', alignItems:'center' }} className="anim-appear" style={{ animationDelay: `${idx*0.06}s`, display:'flex', alignItems:'center' }}>
                {/* Node box */}
                <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:3 }}>
                  <div style={{ fontSize:13, color:
                    isPrev ? '#ce93d8' : isCurr ? '#ffcc80' : isNext ? '#90caf9' : 'transparent',
                    height:16
                  }}>
                    {isPrev ? 'prev' : isCurr ? 'curr' : isNext ? 'next' : ''}
                  </div>
                  <div className={`ll-box ${isPrev ? 'prev-ptr' : isCurr ? 'curr-ptr' : isNext ? 'next-ptr' : isRev || done ? 'done' : ''}`}>
                    {val}
                  </div>
                </div>
                {/* Arrow */}
                {idx < NODES.length - 1 && (
                  <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:2 }}>
                    <div style={{ fontSize:14, color:'#d7ccc8', height:16 }}>
                      {isRev ? '←' : '→'}
                    </div>
                    <div style={{
                      fontSize:28,
                      color: isRev ? '#4caf50' : '#8d6e63',
                      transform: isRev ? 'scaleX(-1)' : 'scaleX(1)',
                      transition: 'transform .4s',
                      margin: '0 4px',
                    }}>→</div>
                  </div>
                )}
              </div>
            );
          })}
          {/* null */}
          <div style={{ display:'flex', alignItems:'center', gap:8, marginLeft:4 }}>
            <div style={{ fontSize:24, color:'#8d6e63' }}>→</div>
            <div style={{ fontSize:20, color:'#8d6e63', fontFamily:"'VT323',monospace" }}>null</div>
          </div>
        </div>

        {/* Algorithm state */}
        <Parchment style={{ marginBottom:12, fontSize:17 }}>
          <pre style={{ color:'#3e2723', lineHeight:1.7 }}>
{`prev  = ${prevIdx >= 0 ? NODES[prevIdx] : 'null'}
curr  = ${currIdx < NODES.length ? NODES[currIdx] : 'null (done!)'}
next  = ${nextIdx >= 0 && nextIdx < NODES.length ? NODES[nextIdx] : 'null'}
Step  = ${step} / ${TOTAL_STEPS}`}
          </pre>
        </Parchment>

        {/* Controls */}
        {!done && !showChoice && (
          <PxBtn variant="org" onClick={advance} disabled={currIdx >= NODES.length}>
            ⚙️ Advance Step {step+1}
          </PxBtn>
        )}

        {showChoice && (
          <div>
            <div style={{ fontSize:20, marginBottom:10, color:SPRITE_C[6] }}>
              Where should <strong>curr.next</strong> point?
            </div>
            <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
              <PxBtn variant="pur" onClick={() => choose('prev')}>
                ← prev ({prevIdx >= 0 ? NODES[prevIdx] : 'null'})
              </PxBtn>
              <PxBtn variant="blu" onClick={() => choose('next')}>
                next ({nextIdx >= 0 ? NODES[nextIdx] : 'null'}) →
              </PxBtn>
              {nextIdx + 1 < NODES.length && (
                <PxBtn variant="brn" onClick={() => choose('skip')}>
                  skip ahead ({NODES[nextIdx+1]})
                </PxBtn>
              )}
            </div>
          </div>
        )}

        {feedback && <FeedbackBanner msg={feedback.msg} type={feedback.type} />}
      </WoodPanel>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   GAME 4 — BFS TRAVERSAL
═══════════════════════════════════════════════ */
function BFSGame({ onComplete, addXP }) {
  // Graph: 7 nodes, BFS from 0 → correct order: 0,1,2,3,4,5,6
  const GRAPH = {
    nodes: [
      { id:0, label:'A', x:180, y:50  },
      { id:1, label:'B', x:80,  y:150 },
      { id:2, label:'C', x:290, y:150 },
      { id:3, label:'D', x:30,  y:260 },
      { id:4, label:'E', x:140, y:260 },
      { id:5, label:'F', x:230, y:260 },
      { id:6, label:'G', x:330, y:260 },
    ],
    edges: [[0,1],[0,2],[1,3],[1,4],[2,5],[2,6]],
    adj:   { 0:[1,2], 1:[0,3,4], 2:[0,5,6], 3:[1], 4:[1], 5:[2], 6:[2] },
  };
  const BFS_ORDER = [0,1,2,3,4,5,6];

  const [visited, setVisited]   = useState([]);
  const [queue, setQueue]       = useState([0]);
  const [step, setStep]         = useState(0);
  const [done, setDone]         = useState(false);
  const [feedback, setFeedback] = useState({ msg:'Click node A to start BFS! Select nodes in the correct BFS order.', type:'info' });
  const [shake, setShake]       = useState(false);
  const [history, setHistory]   = useState([]);

  const nextExpected = BFS_ORDER[step];

  const visitNode = (nodeId) => {
    if (done || visited.includes(nodeId)) return;
    if (nodeId !== nextExpected) {
      setShake(true); setTimeout(() => setShake(false), 400);
      const exp = GRAPH.nodes.find(n => n.id === nextExpected);
      setFeedback({ msg:`❌ Wrong! Visit node ${exp.label} next (BFS processes queue front first).`, type:'error' });
      return;
    }
    const node = GRAPH.nodes.find(n => n.id === nodeId);
    const newVisited = [...visited, nodeId];
    const neighbors = GRAPH.adj[nodeId].filter(n => !newVisited.includes(n) && !queue.slice(1).includes(n));
    const newQueue = [...queue.slice(1), ...neighbors];
    setVisited(newVisited); setQueue(newQueue);
    setHistory(h => [...h, node.label]); setStep(s => s + 1);

    if (newVisited.length === GRAPH.nodes.length) {
      setDone(true); addXP(20, 400, 300);
      setFeedback({ msg:'🎉 All nodes visited in perfect BFS order! +20 XP!', type:'success' });
    } else {
      setFeedback({ msg:`✅ Visited ${node.label}! Queue: [${newQueue.map(n => GRAPH.nodes[n].label).join(' → ')}]`, type:'success' });
    }
  };

  const reset = () => {
    setVisited([]); setQueue([0]); setStep(0); setDone(false); setHistory([]);
    setFeedback({ msg:'Click node A to start BFS!', type:'info' });
  };

  const SVG_W = 380, SVG_H = 320;

  return (
    <div className={shake ? 'anim-scrnshk' : ''}>
      <WoodPanel style={{ marginBottom:16 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:8 }}>
          <div>
            <div style={{ fontSize:24, color:SPRITE_C[6] }}>🗺️ BFS Labyrinth</div>
            <div style={{ fontSize:16, color:'#d7ccc8' }}>Visited: {visited.length}/{GRAPH.nodes.length} · Step: {step}</div>
          </div>
          <div style={{ display:'flex', gap:8 }}>
            <PxBtn variant="brn" size="sm" onClick={reset}>↺ Reset</PxBtn>
            {done && <PxBtn variant="grn" onClick={onComplete}>Next Level →</PxBtn>}
          </div>
        </div>
      </WoodPanel>

      <Parchment style={{ marginBottom:16 }}>
        <div style={{ fontSize:18, color:'#5d4037' }}>
          <strong>BFS Rule:</strong> Always visit the node at the <em>front</em> of the queue next.
          Neighbors get added to the <em>back</em>. Level by level exploration!
        </div>
      </Parchment>

      <div style={{ display:'flex', gap:16, flexWrap:'wrap', marginBottom:16 }}>
        {/* Graph SVG */}
        <WoodPanel style={{ flex:'1 1 360px', minWidth:300 }}>
          <div style={{ fontSize:18, color:SPRITE_C[6], marginBottom:8 }}>📊 Graph — click the correct node!</div>
          <svg width="100%" viewBox={`0 0 ${SVG_W} ${SVG_H}`} style={{ display:'block', maxHeight:320 }}>
            {/* Edges */}
            {GRAPH.edges.map(([a,b],i) => {
              const na = GRAPH.nodes[a], nb = GRAPH.nodes[b];
              const bothVisited = visited.includes(a) && visited.includes(b);
              return (
                <line key={i}
                  x1={na.x+28} y1={na.y+28} x2={nb.x+28} y2={nb.y+28}
                  stroke={bothVisited ? '#4caf50' : '#8d6e63'} strokeWidth={bothVisited ? 3 : 2}
                  strokeDasharray={bothVisited ? '0' : '4,3'}
                />
              );
            })}
            {/* Nodes */}
            {GRAPH.nodes.map(node => {
              const isVisited  = visited.includes(node.id);
              const inQueue    = queue.includes(node.id);
              const isCurrent  = visited.length > 0 && visited[visited.length-1] === node.id;
              const isNext     = node.id === nextExpected && !done;
              return (
                <g key={node.id} style={{ cursor: isVisited ? 'default' : 'pointer' }} onClick={() => visitNode(node.id)}>
                  <circle cx={node.x+28} cy={node.y+28} r={26}
                    fill={isVisited ? '#4caf50' : inQueue ? '#fff9c4' : '#d7ccc8'}
                    stroke={isNext ? '#ffd700' : isVisited ? '#2e7d32' : '#5d4037'}
                    strokeWidth={isNext ? 4 : 3}
                    style={{ filter: isNext ? 'drop-shadow(0 0 8px #ffd700)' : isCurrent ? 'drop-shadow(0 0 10px #ff9800)' : 'none' }}
                  />
                  <text x={node.x+28} y={node.y+35}
                    textAnchor="middle"
                    fill={isVisited ? '#fff' : '#3e2723'}
                    fontSize={22} fontFamily="'VT323',monospace"
                  >{node.label}</text>
                  {isNext && (
                    <text x={node.x+28} y={node.y+12} textAnchor="middle" fill="#ffd700" fontSize={14} fontFamily="'VT323',monospace">★next</text>
                  )}
                </g>
              );
            })}
          </svg>
        </WoodPanel>

        {/* Queue + History panel */}
        <div style={{ flex:'0 0 200px', display:'flex', flexDirection:'column', gap:12 }}>
          {/* Queue */}
          <WoodPanel>
            <div style={{ fontSize:18, color:SPRITE_C[6], marginBottom:8 }}>📋 Queue</div>
            {queue.length === 0 && !done ? (
              <div style={{ fontSize:16, color:'#8d6e63' }}>empty</div>
            ) : done ? (
              <div style={{ fontSize:16, color:'#a5d6a7' }}>done!</div>
            ) : (
              queue.map((nid, qi) => {
                const n = GRAPH.nodes[nid];
                return (
                  <div key={qi} style={{
                    padding:'4px 10px', marginBottom:4, border:'2px solid',
                    borderColor: qi===0 ? '#ffd700' : '#5d4037',
                    background: qi===0 ? 'rgba(255,215,0,.2)' : 'rgba(93,64,37,.2)',
                    borderRadius:2, fontSize:18, color:SPRITE_C[6],
                    fontFamily:"'VT323',monospace",
                  }}>
                    {qi===0 ? '→ ' : '  '}{n.label}
                  </div>
                );
              })
            )}
          </WoodPanel>
          {/* Visit History */}
          <WoodPanel>
            <div style={{ fontSize:18, color:SPRITE_C[6], marginBottom:8 }}>🏃 Visited</div>
            <div style={{ fontSize:20, color:'#a5d6a7', fontFamily:"'VT323',monospace", letterSpacing:2 }}>
              {history.length > 0 ? history.join(' → ') : '—'}
            </div>
          </WoodPanel>
        </div>
      </div>

      <WoodPanel>
        {feedback && <FeedbackBanner msg={feedback.msg} type={feedback.type} />}
      </WoodPanel>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   GAME 5 — VALID PARENTHESES (STACK GAME)
═══════════════════════════════════════════════ */
function ParenthesesGame({ onComplete, addXP }) {
  const INPUT = ['(', '{', '[', ']', '}', ')'];
  const MATCH = { ')':'(', '}':'{', ']':'[' };
  const OPEN  = new Set(['(', '{', '[']);

  const [charIdx, setCharIdx]   = useState(0);
  const [stack, setStack]       = useState([]);
  const [done, setDone]         = useState(false);
  const [failed, setFailed]     = useState(false);
  const [feedback, setFeedback] = useState({ msg:'Push opening brackets onto the stack. Pop & match closing brackets!', type:'info' });
  const [charAnim, setCharAnim] = useState(false);
  const [matchAnim, setMatchAnim] = useState(false);
  const [shake, setShake]       = useState(false);

  const current = INPUT[charIdx];
  const isOpen  = current ? OPEN.has(current) : false;

  const push = () => {
    if (done || failed || !current) return;
    if (!isOpen) {
      setShake(true); setTimeout(() => setShake(false), 400);
      setFeedback({ msg:`❌ '${current}' is a closing bracket — you should POP, not push!`, type:'error' });
      return;
    }
    setStack(s => [...s, current]);
    setCharIdx(i => i + 1);
    setCharAnim(true); setTimeout(() => setCharAnim(false), 300);
    checkDone(charIdx + 1, [...stack, current]);
    setFeedback({ msg:`✅ Pushed '${current}' onto the stack!`, type:'success' });
  };

  const pop = () => {
    if (done || failed || !current) return;
    if (isOpen) {
      setShake(true); setTimeout(() => setShake(false), 400);
      setFeedback({ msg:`❌ '${current}' is an opening bracket — PUSH it first!`, type:'error' });
      return;
    }
    const top = stack[stack.length - 1];
    if (top === MATCH[current]) {
      const newStack = stack.slice(0, -1);
      setStack(newStack);
      setCharIdx(i => i + 1);
      setMatchAnim(true); setTimeout(() => setMatchAnim(false), 400);
      setFeedback({ msg:`✅ Matched! '${top}' + '${current}' = valid pair! 🎊`, type:'success' });
      checkDone(charIdx + 1, newStack);
    } else {
      setFailed(true);
      setFeedback({ msg:`❌ Mismatch! Top of stack is '${top}', but '${current}' doesn't match!`, type:'error' });
    }
  };

  const checkDone = (nextIdx, curStack) => {
    if (nextIdx >= INPUT.length) {
      if (curStack.length === 0) {
        setDone(true); addXP(30, 400, 300);
        setFeedback({ msg:'🎉 All brackets matched! Stack is empty! PERFECT! +30 XP!', type:'success' });
      } else {
        setFailed(true);
        setFeedback({ msg:'❌ Input consumed but stack is not empty — unmatched brackets!', type:'error' });
      }
    }
  };

  const reset = () => {
    setCharIdx(0); setStack([]); setDone(false); setFailed(false);
    setCharAnim(false); setMatchAnim(false);
    setFeedback({ msg:'Push opening brackets onto the stack. Pop & match closing brackets!', type:'info' });
  };

  return (
    <div className={shake ? 'anim-scrnshk' : ''}>
      <WoodPanel style={{ marginBottom:16 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:8 }}>
          <div>
            <div style={{ fontSize:24, color:SPRITE_C[6] }}>🗼 Bracket Guardian</div>
            <div style={{ fontSize:16, color:'#d7ccc8' }}>Input: "{INPUT.join('')}" · Stack depth: {stack.length}</div>
          </div>
          <div style={{ display:'flex', gap:8 }}>
            <PxBtn variant="brn" size="sm" onClick={reset}>↺ Reset</PxBtn>
            {done && <PxBtn variant="grn" onClick={onComplete}>Complete! 🏆</PxBtn>}
          </div>
        </div>
      </WoodPanel>

      <Parchment style={{ marginBottom:16 }}>
        <div style={{ fontSize:18, color:'#5d4037' }}>
          <strong>Stack Rules:</strong> Opening brackets <strong>( &#123; [</strong> → PUSH.
          Closing brackets <strong>) &#125; ]</strong> → POP and match with top of stack.
          Stack must be empty at the end!
        </div>
      </Parchment>

      <div style={{ display:'flex', gap:16, flexWrap:'wrap', marginBottom:16 }}>
        {/* Input queue */}
        <WoodPanel style={{ flex:'1 1 300px' }}>
          <div style={{ fontSize:18, color:SPRITE_C[6], marginBottom:10 }}>📥 Input Sequence</div>
          <div style={{ display:'flex', gap:8, alignItems:'flex-end', flexWrap:'wrap' }}>
            {INPUT.map((ch, i) => (
              <div key={i} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                <div style={{
                  width:52, height:52, display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:28, fontFamily:"'VT323',monospace",
                  border:'3px solid',
                  borderColor: i < charIdx ? '#4caf50' : i === charIdx ? '#ffd700' : '#5d4037',
                  background: i < charIdx ? 'rgba(76,175,80,.2)' : i === charIdx ? 'rgba(255,215,0,.2)' : '#d7ccc8',
                  color: i < charIdx ? '#4caf50' : i === charIdx ? '#ffd700' : '#3e2723',
                  borderRadius:2,
                  animation: i === charIdx ? 'float 1.5s ease-in-out infinite' : 'none',
                  boxShadow: i === charIdx ? '0 0 14px rgba(255,215,0,.6)' : '2px 2px 0 #5d4037',
                }}>
                  {i < charIdx ? '✓' : ch}
                </div>
                <div style={{ fontSize:14, color:i===charIdx?'#ffd700':'#8d6e63' }}>[{i}]</div>
              </div>
            ))}
          </div>

          {/* Current character */}
          {current && !done && !failed && (
            <div style={{ marginTop:14 }}>
              <div style={{ fontSize:20, color:SPRITE_C[6] }}>
                Current: <span style={{
                  fontSize:36, color: isOpen ? '#90caf9' : '#ef9a9a',
                  animation:'float 1s ease-in-out infinite',
                  display:'inline-block',
                }}>{current}</span>
                &nbsp;({isOpen ? '🔵 Opening → PUSH' : '🔴 Closing → POP'})
              </div>
            </div>
          )}

          {/* Action buttons */}
          {!done && !failed && current && (
            <div style={{ display:'flex', gap:12, marginTop:14 }}>
              <PxBtn variant="blu" onClick={push} disabled={!isOpen}>
                ⬇ PUSH '{current}'
              </PxBtn>
              <PxBtn variant="red" onClick={pop} disabled={isOpen || stack.length === 0}>
                ⬆ POP & MATCH
              </PxBtn>
            </div>
          )}

          {feedback && <FeedbackBanner msg={feedback.msg} type={feedback.type} />}
        </WoodPanel>

        {/* Stack visual */}
        <WoodPanel style={{ flex:'0 0 180px', minWidth:160 }}>
          <div style={{ fontSize:18, color:SPRITE_C[6], marginBottom:8 }}>🗼 Stack</div>
          {/* Stack grows upward */}
          <div style={{ display:'flex', flexDirection:'column-reverse', gap:4, minHeight:180 }}>
            {stack.length === 0 ? (
              <div style={{ fontSize:16, color:'#8d6e63', textAlign:'center', paddingTop:40 }}>empty</div>
            ) : (
              stack.map((ch, i) => (
                <div key={i}
                  className={`stk-slot ${matchAnim && i === stack.length-1 ? 'match' : ''}`}
                  style={{
                    animation: i === stack.length-1 && charAnim ? 'fall .3s ease-out' : 'none',
                  }}
                >
                  {ch}
                  {i === stack.length-1 && <span style={{ position:'absolute', right:-28, fontSize:13, color:SPRITE_C[6] }}>←top</span>}
                </div>
              ))
            )}
          </div>
          {/* Stack base */}
          <div style={{ height:6, background:'#5d4037', borderRadius:'0 0 2px 2px', marginTop:4 }} />
          <div style={{ textAlign:'center', fontSize:15, color:'#8d6e63', marginTop:4 }}>BOTTOM</div>
        </WoodPanel>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   LOGIN PAGE
═══════════════════════════════════════════════ */
function LoginPage({ onLogin, initialError = '' }) {
  const [email, setEmail]  = useState('');
  const [pass, setPass]    = useState('');
  const [name, setName]    = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [err, setErr]      = useState('');
  const [isBusy, setIsBusy] = useState(false);

  useEffect(() => {
    setErr(initialError);
  }, [initialError]);

  const submit = async () => {
    if (!email || !pass || (isSignup && !name)) { setErr('All fields required!'); return; }
    if (pass.length < 6) { setErr('Password must be at least 6 characters.'); return; }

    setIsBusy(true);
    setErr('');

    try {
      const response = isSignup
        ? await api.signup({ name, email, password: pass })
        : await api.login({ email, password: pass });

      saveSession(response.token);
      onLogin(response.user);
    } catch (error) {
      clearSession();
      setErr(error.message);
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:16, position:'relative', zIndex:1 }}>
      <div style={{ width:'100%', maxWidth:400 }}>
        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:24 }}>
          <div style={{ fontSize:18, color:SPRITE_C[6], letterSpacing:4, marginBottom:4 }}>✦ ✦ ✦</div>
          <div style={{ fontSize:52, color:SPRITE_C[6], textShadow:'3px 3px 0 #e65100, 6px 6px 0 rgba(0,0,0,.4)' }}>
            AlgoQuest
          </div>
          <div style={{ fontSize:20, color:'#d7ccc8', letterSpacing:2 }}>A PIXEL DSA ADVENTURE</div>
          <div style={{ marginTop:12 }} className="anim-float">
            <FarmerSprite sz={4} />
          </div>
        </div>

        <WoodPanel>
          <Parchment style={{ marginBottom:0 }}>
            <div style={{ fontSize:26, textAlign:'center', marginBottom:16 }}>
              {isSignup ? '📜 Create Account' : '🔑 Login'}
            </div>
            <Divider />
            <div style={{ display:'flex', flexDirection:'column', gap:10, marginTop:12 }}>
              {isSignup && (
                <div>
                  <div style={{ fontSize:18, marginBottom:4 }}>Farmer Name</div>
                  <PxInput value={name} onChange={setName} placeholder="Farmer Joe..." />
                </div>
              )}
              <div>
                <div style={{ fontSize:18, marginBottom:4 }}>Email</div>
                <PxInput value={email} onChange={setEmail} placeholder="hero@farm.com" />
              </div>
              <div>
                <div style={{ fontSize:18, marginBottom:4 }}>Password</div>
                <PxInput value={pass} onChange={setPass} placeholder="••••••••" type="password" />
              </div>
              {err && <div style={{ color:'#b71c1c', fontSize:18 }}>⚠️ {err}</div>}
              <PxBtn variant="grn" onClick={submit} disabled={isBusy} size="lg" style={{ width:'100%', justifyContent:'center', marginTop:6 }}>
                {isSignup ? '🌱 Start Adventure!' : '⚔️ Enter Quest!'}
              </PxBtn>
              <PxBtn variant="brn" disabled={isBusy} onClick={() => { setIsSignup(s => !s); setErr(''); }}
                style={{ width:'100%', justifyContent:'center', fontSize:17 }}>
                {isSignup ? 'Already a hero? Login' : 'New hero? Sign Up'}
              </PxBtn>
            </div>
          </Parchment>
        </WoodPanel>

        <div style={{ textAlign:'center', marginTop:12, fontSize:16, color:'#8d6e63' }}>
          ★ Master Arrays · Linked Lists · Graphs · Stacks ★
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   DASHBOARD
═══════════════════════════════════════════════ */
function Dashboard({ user, onNavigate }) {
  const totalProblems = WORLDS.reduce((s, w) => s + w.problems.length, 0);
  const completedCount = user.completed.length;
  const xpForLevel = 100;
  const currentXP = user.xp % xpForLevel;

  const TIPS = [
    'Bubble Sort runs in O(n²) — watch the passes!',
    'Sliding Window avoids nested loops → O(n).',
    'Reversing a linked list needs only 3 pointers!',
    'BFS uses a Queue (FIFO) for level-order traversal.',
    'A valid brackets string has a balanced stack.',
  ];
  const tip = TIPS[Math.floor(Date.now() / 5000) % TIPS.length];

  return (
    <div style={{ minHeight:'100vh', padding:'16px', position:'relative', zIndex:1 }}>
      {/* Top nav */}
      <WoodPanel style={{ marginBottom:16, display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:10 }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <FarmerSprite sz={2} walk />
          <div>
            <div style={{ fontSize:26, color:SPRITE_C[6] }}>AlgoQuest</div>
            <div style={{ fontSize:16, color:'#d7ccc8' }}>Welcome back, {user.name}!</div>
          </div>
        </div>
        <div style={{ display:'flex', gap:12, alignItems:'center' }}>
          <div style={{ textAlign:'right' }}>
            <div style={{ fontSize:18, color:SPRITE_C[6] }}>⭐ {user.xp} XP</div>
            <div style={{ fontSize:16, color:'#d7ccc8' }}>Level {Math.floor(user.xp / xpForLevel) + 1}</div>
          </div>
          <PxBtn variant="grn" onClick={() => onNavigate('worlds')}>🗺️ Play!</PxBtn>
        </div>
      </WoodPanel>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:16, maxWidth:1000, margin:'0 auto' }}>
        {/* XP & Progress */}
        <WoodPanel>
          <Parchment>
            <div style={{ fontSize:22, marginBottom:8 }}>⭐ XP Progress</div>
            <div style={{ fontSize:36, color:'#5d4037', marginBottom:4 }}>{user.xp} / ∞ XP</div>
            <div style={{ fontSize:18, marginBottom:8, color:'#5d4037' }}>
              Level {Math.floor(user.xp / xpForLevel) + 1} Adventurer
            </div>
            <ProgBar value={currentXP} max={xpForLevel} />
            <div style={{ fontSize:15, marginTop:4, color:'#8d6e63' }}>{currentXP}/{xpForLevel} to next level</div>
          </Parchment>
        </WoodPanel>

        {/* Problems completed */}
        <WoodPanel>
          <Parchment>
            <div style={{ fontSize:22, marginBottom:8 }}>📋 Problems</div>
            <div style={{ fontSize:48, color:'#5d4037' }}>{completedCount}<span style={{ fontSize:24 }}>/{totalProblems}</span></div>
            <ProgBar value={completedCount} max={totalProblems} />
            <div style={{ fontSize:16, marginTop:6, color:'#5d4037' }}>
              {totalProblems - completedCount > 0 ? `${totalProblems - completedCount} remaining` : '🎉 All complete!'}
            </div>
          </Parchment>
        </WoodPanel>

        {/* Quick tip */}
        <WoodPanel style={{ gridColumn:'1/-1' }}>
          <Parchment>
            <div style={{ fontSize:22, marginBottom:6 }}>💡 Algorithm Tip</div>
            <div style={{ fontSize:20, color:'#5d4037' }}>{tip}</div>
          </Parchment>
        </WoodPanel>

        {/* World quick-links */}
        {WORLDS.map(world => {
          const done = world.problems.every(p => user.completed.includes(p.id));
          return (
            <div key={world.id}
              onClick={() => onNavigate('worlds')}
              style={{
                cursor:'pointer', padding:2,
                background: `linear-gradient(135deg, ${world.color}66, ${world.color}33)`,
                border:`3px solid ${world.color}`,
                borderRadius:3, transition:'transform .2s',
              }}
              onMouseOver={e => e.currentTarget.style.transform='scale(1.03)'}
              onMouseOut={e => e.currentTarget.style.transform='scale(1)'}
            >
              <WoodPanel style={{ background:'transparent', boxShadow:'none', border:'none' }}>
                <div style={{ fontSize:32 }}>{world.icon}</div>
                <div style={{ fontSize:20, color:SPRITE_C[6] }}>{world.name}</div>
                <div style={{ fontSize:16, color:'#d7ccc8', marginBottom:6 }}>
                  {world.problems.filter(p => user.completed.includes(p.id)).length}/{world.problems.length} done
                </div>
                {done && <span className="badge-done">✓ CLEAR</span>}
              </WoodPanel>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   WORLDS PAGE
═══════════════════════════════════════════════ */
function WorldsPage({ user, onSelectGame, onBack }) {
  const isWorldUnlocked = (worldIdx) => {
    if (worldIdx === 0) return true;
    const prevWorld = WORLDS[worldIdx - 1];
    return prevWorld.problems.every(p => user.completed.includes(p.id));
  };

  return (
    <div style={{ minHeight:'100vh', padding:16, position:'relative', zIndex:1 }}>
      <WoodPanel style={{ marginBottom:16, display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:10 }}>
        <div style={{ fontSize:28, color:SPRITE_C[6] }}>🗺️ World Map</div>
        <div style={{ display:'flex', gap:10, alignItems:'center' }}>
          <div style={{ fontSize:20, color:SPRITE_C[6] }}>⭐ {user.xp} XP</div>
          <PxBtn variant="brn" onClick={onBack}>← Dashboard</PxBtn>
        </div>
      </WoodPanel>

      <div style={{ maxWidth:900, margin:'0 auto' }}>
        {WORLDS.map((world, wi) => {
          const unlocked = isWorldUnlocked(wi);
          return (
            <div key={world.id} style={{ marginBottom:20 }}>
              {/* World header */}
              <div style={{
                padding:'12px 18px', marginBottom:10,
                background: unlocked ? `linear-gradient(90deg, ${world.color}, ${world.accent}44)` : '#3e2723',
                border:`3px solid ${unlocked ? world.accent : '#5d4037'}`,
                borderRadius:3,
                boxShadow:`0 4px 0 ${unlocked ? world.color : '#2d1b0e'}`,
                display:'flex', justifyContent:'space-between', alignItems:'center',
              }}>
                <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <span style={{ fontSize:36 }}>{world.icon}</span>
                  <div>
                    <div style={{ fontSize:26, color:SPRITE_C[6] }}>{world.name}</div>
                    <div style={{ fontSize:16, color:'#d7ccc8' }}>{world.desc}</div>
                  </div>
                </div>
                {!unlocked && <span style={{ fontSize:24 }}>🔒</span>}
                {unlocked && (
                  <div style={{ fontSize:16, color:'#a5d6a7' }}>
                    {world.problems.filter(p => user.completed.includes(p.id)).length}/{world.problems.length} ✓
                  </div>
                )}
              </div>

              {/* Problems */}
              <div style={{ display:'flex', flexDirection:'column', gap:10, paddingLeft:24 }}>
                {world.problems.map((prob, pi) => {
                  const isComplete = user.completed.includes(prob.id);
                  const locked = !unlocked;
                  return (
                    <div key={prob.id} style={{
                      display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:10,
                      padding:'12px 16px',
                      background: isComplete ? 'rgba(76,175,80,.15)' : locked ? 'rgba(62,39,35,.5)' : 'rgba(93,64,37,.3)',
                      border:`3px solid ${isComplete ? '#4caf50' : locked ? '#3e2723' : '#5d4037'}`,
                      borderRadius:2, cursor: locked ? 'not-allowed' : 'pointer',
                      transition:'transform .15s',
                    }}
                      onMouseOver={e => { if (!locked) e.currentTarget.style.transform='scale(1.01)'; }}
                      onMouseOut={e => e.currentTarget.style.transform='scale(1)'}
                      onClick={() => { if (!locked) onSelectGame(world, prob); }}
                    >
                      <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                        <div style={{ fontSize:28 }}>{isComplete ? '✅' : locked ? '🔒' : '▶'}</div>
                        <div>
                          <div style={{ fontSize:22, color:SPRITE_C[6] }}>{prob.title}</div>
                          <div style={{ fontSize:16, color:'#d7ccc8' }}>{prob.desc}</div>
                        </div>
                      </div>
                      <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                        <span className={`badge-${prob.diff}`}>{prob.diff.toUpperCase()}</span>
                        <span style={{
                          padding:'2px 10px', border:'2px solid #ffd700',
                          background:'rgba(255,215,0,.15)', color:SPRITE_C[6], fontSize:16,
                          borderRadius:2, fontFamily:"'VT323',monospace",
                        }}>+{prob.xp} XP</span>
                        {isComplete && <span className="badge-done">DONE</span>}
                        {!locked && !isComplete && (
                          <PxBtn variant="grn" size="sm" onClick={e => { e.stopPropagation(); onSelectGame(world, prob); }}>
                            Play →
                          </PxBtn>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   GAME PAGE (CONTAINER)
═══════════════════════════════════════════════ */
function GamePage({ user, world, problem, onComplete, onBack, addXP }) {
  const handleComplete = () => onComplete(problem);

  const GAME_MAP = {
    bubble: BubbleSortGame,
    window: SlidingWindowGame,
    linked: LinkedListGame,
    bfs:    BFSGame,
    parens: ParenthesesGame,
  };
  const GameComp = GAME_MAP[problem.type];

  return (
    <div style={{ minHeight:'100vh', padding:16, position:'relative', zIndex:1 }}>
      {/* Header */}
      <WoodPanel style={{ marginBottom:16, display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:10 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <span style={{ fontSize:28 }}>{world.icon}</span>
          <div>
            <div style={{ fontSize:22, color:SPRITE_C[6] }}>{problem.title}</div>
            <div style={{ fontSize:16, color:'#d7ccc8' }}>{world.name}</div>
          </div>
          <span className={`badge-${problem.diff}`} style={{ marginLeft:8 }}>{problem.diff}</span>
          <span style={{ padding:'2px 8px', border:'2px solid #ffd700', background:'rgba(255,215,0,.15)', color:SPRITE_C[6], fontSize:15, borderRadius:2, fontFamily:"'VT323',monospace" }}>
            +{problem.xp} XP
          </span>
          {user.completed.includes(problem.id) && <span className="badge-done" style={{ marginLeft:4 }}>✓ DONE</span>}
        </div>
        <div style={{ display:'flex', gap:10, alignItems:'center' }}>
          <div style={{ fontSize:18, color:SPRITE_C[6] }}>⭐ {user.xp} XP</div>
          <PxBtn variant="brn" onClick={onBack}>← Map</PxBtn>
        </div>
      </WoodPanel>

      <div style={{ maxWidth:900, margin:'0 auto' }}>
        {GameComp ? (
          <GameComp onComplete={handleComplete} addXP={addXP} />
        ) : (
          <WoodPanel><div style={{ fontSize:24, color:'#ef9a9a' }}>Game not found: {problem.type}</div></WoodPanel>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   MAIN APP
═══════════════════════════════════════════════ */
export default function AlgoQuest() {
  // Inject styles
  useEffect(() => {
    const id = 'aq-styles';
    if (!document.getElementById(id)) {
      const s = document.createElement('style');
      s.id = id; s.textContent = STYLES;
      document.head.appendChild(s);
    }
  }, []);

  const [page, setPage]         = useState('login');
  const [user, setUser]         = useState(null);
  const [selWorld, setSelWorld] = useState(null);
  const [selProb, setSelProb]   = useState(null);
  const [xpPopups, setXpPopups] = useState([]);
  const [booting, setBooting]   = useState(true);
  const [appError, setAppError] = useState('');

  const addXP = useCallback((amount, x = 400, y = 300) => {
    const id = Date.now() + Math.random();
    setXpPopups(p => [...p, { id, amount, x, y }]);
    setTimeout(() => setXpPopups(p => p.filter(pp => pp.id !== id)), 1600);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const restoreSession = async () => {
      if (!getStoredToken()) {
        if (isMounted) setBooting(false);
        return;
      }

      try {
        const response = await api.me();
        if (!isMounted) return;
        setUser(normalizeUser(response.user));
        setPage('dashboard');
      } catch (error) {
        clearSession();
        if (isMounted) setAppError(error.message);
      } finally {
        if (isMounted) setBooting(false);
      }
    };

    restoreSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogin = (userData) => {
    setAppError('');
    setUser(normalizeUser(userData));
    setPage('dashboard');
  };

  const handleSelectGame = (world, prob) => {
    setAppError('');
    setSelWorld(world); setSelProb(prob); setPage('game');
  };

  const handleCompleteGame = async (prob) => {
    try {
      const response = await api.complete(prob.id);

      if (response.xpAwarded > 0) {
        addXP(response.xpAwarded);
      }

      setUser(u => normalizeUser({
        ...u,
        xp: response.totalXP,
        currentWorld: response.currentWorld,
        completed: u.completed.includes(prob.id) ? u.completed : [...u.completed, prob.id],
      }));
      setAppError('');
      setPage('worlds');
    } catch (error) {
      setAppError(error.message);
    }
  };

  return (
    <div style={{ minHeight:'100vh', background:'#1a0e05', position:'relative' }}>
      <StarBg />

      {/* XP Popups */}
      {xpPopups.map(p => (
        <div key={p.id} className="xp-popup" style={{ left:p.x, top:p.y }}>
          +{p.amount} XP ⭐
        </div>
      ))}

      {booting && (
        <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', position:'relative', zIndex:1 }}>
          <WoodPanel>
            <div style={{ fontSize:28, color:SPRITE_C[6] }}>Loading AlgoQuest...</div>
          </WoodPanel>
        </div>
      )}

      {!booting && appError && page !== 'login' && (
        <div style={{ position:'fixed', top:16, left:'50%', transform:'translateX(-50%)', width:'min(520px, calc(100% - 32px))', zIndex:3 }}>
          <FeedbackBanner msg={appError} type="error" />
        </div>
      )}

      {/* Page Router */}
      {!booting && page === 'login' && <LoginPage onLogin={handleLogin} initialError={appError} />}

      {!booting && page === 'dashboard' && user && (
        <Dashboard user={user} onNavigate={p => setPage(p)} />
      )}

      {!booting && page === 'worlds' && user && (
        <WorldsPage
          user={user}
          onSelectGame={handleSelectGame}
          onBack={() => setPage('dashboard')}
        />
      )}

      {!booting && page === 'game' && user && selWorld && selProb && (
        <GamePage
          user={user}
          world={selWorld}
          problem={selProb}
          onComplete={handleCompleteGame}
          onBack={() => setPage('worlds')}
          addXP={addXP}
        />
      )}
    </div>
  );
}
