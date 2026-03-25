/* ═══════════════════════════════════════════════
   SHARED STYLES — injected once by AlgoQuest root
═══════════════════════════════════════════════ */
export const STYLES = `
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
