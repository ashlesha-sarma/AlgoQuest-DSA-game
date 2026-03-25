// 🔥 FULLY PATCHED FILE — PART 1

import { useState, useEffect, useRef } from "react";
import { api, clearSession } from "../lib/api";

/* =========================
   SPRITE (Explorer)
========================= */
const SPRITE = [
  [0,0,3,3,3,3,0,0],
  [0,3,1,1,1,1,3,0],
  [0,0,1,2,2,1,0,0],
  [0,0,1,1,1,1,0,0],
  [0,4,4,4,4,4,4,5],
  [4,4,4,4,4,4,4,5],
  [0,4,6,6,6,6,4,5],
  [0,7,7,4,4,7,7,0],
  [0,7,0,7,7,0,7,0],
  [0,7,0,7,7,0,7,0],
  [0,8,8,0,0,8,8,0],
  [0,8,8,0,0,8,8,0],
];

const SPRITE_C = ['transparent','#ffcc80','#2d2d2d','#5d3a1a','#c62828','#bdbdbd','#ffd700','#795548','#4e342e'];

function ExplorerSprite({ sz = 3, flip = false }) {
  return (
    <div className="pixel-art" style={{ display:'inline-block', lineHeight:0, transform: flip ? 'scaleX(-1)' : 'scaleX(1)' }}>
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

/* =========================
   USER NORMALIZATION FIX
========================= */
function normalizeUser(user) {
  if (!user) return null;

  return {
    ...user,
    name: user.name || 'Adventurer',
    completed: Array.isArray(user.completed) ? user.completed : [],
    xp: user.xp ?? 0,
    currentWorld: user.currentWorld ?? 1,
  };
}

/* =========================
   BUBBLE SORT GAME FIX
========================= */
function BubbleSortGame({ onComplete, addXP }) {
  const INIT = [64, 34, 25, 12, 22, 11, 90];
  const [arr, setArr] = useState([...INIT]);
  const [i, setI] = useState(0);
  const [j, setJ] = useState(0);
  const [done, setDone] = useState(false);
  const [playerFlip, setPlayerFlip] = useState(false);

  const shouldSwap = arr[j] > arr[j + 1];

  const doSwap = () => {
    if (!shouldSwap) return;
    const newArr = [...arr];
    [newArr[j], newArr[j+1]] = [newArr[j+1], newArr[j]];
    setArr(newArr);
    setPlayerFlip(f => !f);
    nextStep();
  };

  const doKeep = () => {
    if (shouldSwap) return;
    nextStep();
  };

  const nextStep = () => {
    if (j >= arr.length - i - 2) {
      if (i >= arr.length - 2) {
        setDone(true);
      } else {
        setI(i + 1);
        setJ(0);
      }
    } else {
      setJ(j + 1);
    }
  };

  return (
    <div>
      <div style={{ display:'flex', gap:8 }}>
        {arr.map((val, idx) => (
          <div key={idx} style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
            
            {/* ✅ FIXED SPRITE */}
            <div style={{ height:104, display:'flex', alignItems:'flex-end', justifyContent:'center', overflow:'visible' }}>
              {idx === j && !done && (
                <div className="anim-walk">
                  <ExplorerSprite sz={2} flip={playerFlip} />
                </div>
              )}
            </div>

            <div className="tile">{val}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop:10 }}>
        <button onClick={doSwap}>Swap</button>
        <button onClick={doKeep}>Keep</button>
      </div>
    </div>
  );
}
// 🔥 PART 2 — LOGOUT + DASHBOARD + PAGES

/* =========================
   DASHBOARD FIX
========================= */
function Dashboard({ user, onNavigate, onLogout }) {
  return (
    <div>
      <h1>Welcome back, Explorer {user.name}!</h1>

      <div style={{ display:'flex', gap:10 }}>
        <button onClick={() => onNavigate('worlds')}>Play</button>

        {/* ✅ LOGOUT BUTTON */}
        <button onClick={onLogout}>🚪 Logout</button>
      </div>
    </div>
  );
}

/* =========================
   WORLDS PAGE FIX
========================= */
function WorldsPage({ user, onSelectGame, onBack, onLogout }) {
  return (
    <div>
      <button onClick={onBack}>← Dashboard</button>

      {/* ✅ LOGOUT */}
      <button onClick={onLogout}>🚪 Logout</button>

      <h2>Select World</h2>
    </div>
  );
}

/* =========================
   GAME PAGE FIX
========================= */
function GamePage({ user, world, problem, onBack, onLogout }) {
  return (
    <div>
      <button onClick={onBack}>← Map</button>

      {/* ✅ LOGOUT */}
      <button onClick={onLogout}>🚪 Logout</button>

      <h2>{problem.title}</h2>
    </div>
  );
}

/* =========================
   MAIN COMPONENT FIX
========================= */
export default function AlgoQuest() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('login');
  const [selWorld, setSelWorld] = useState(null);
  const [selProb, setSelProb] = useState(null);

  const handleLogout = () => {
    clearSession();
    setUser(null);
    setPage('login');
    setSelWorld(null);
    setSelProb(null);
  };

  if (!user) return <div>Login Page</div>;

  if (page === 'dashboard')
    return <Dashboard user={user} onNavigate={setPage} onLogout={handleLogout} />;

  if (page === 'worlds')
    return <WorldsPage user={user} onBack={() => setPage('dashboard')} onLogout={handleLogout} />;

  if (page === 'game')
    return <GamePage user={user} world={selWorld} problem={selProb} onBack={() => setPage('worlds')} onLogout={handleLogout} />;

  return null;
}