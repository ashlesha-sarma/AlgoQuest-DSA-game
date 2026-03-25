import { useState, useEffect, useRef, useCallback } from "react";
import { api, clearSession, getStoredToken, getStoredName } from "../lib/api";

import { STYLES }        from "../utils/styles";
import { normalizeUser } from "../utils/userUtils";
import { StarBg, WoodPanel, FeedbackBanner } from "./ui";

import LoginPage   from "./LoginPage";
import Dashboard   from "./Dashboard";
import WorldsPage  from "./WorldsPage";
import GamePage    from "./GamePage";

/* ═══════════════════════════════════════════════════════════════════════
   ALGOQUEST — Gamified DSA Learning Platform
   A Stardew Valley–inspired pixel art game for learning algorithms
═══════════════════════════════════════════════════════════════════════ */
export default function AlgoQuest() {
  // Inject global styles once
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

  // Restore session on mount
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
        // Overlay stored name so the user's typed username always wins over email-derived name
        const storedName = getStoredName();
        const userData = storedName
          ? { ...response.user, name: storedName }
          : response.user;
        setUser(normalizeUser(userData));
        setPage('dashboard');
      } catch (error) {
        clearSession();
        if (isMounted) setAppError(error.message);
      } finally {
        if (isMounted) setBooting(false);
      }
    };

    restoreSession();
    return () => { isMounted = false; };
  }, []);

  // ── Handlers ──────────────────────────────────────
  const handleLogin = (userData) => {
    setAppError('');
    setUser(normalizeUser(userData));
    setPage('dashboard');
  };

  const handleLogout = () => {
    clearSession?.();
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    setUser(null);
    setPage('login');
    setSelWorld(null);
    setSelProb(null);
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

  // ── Render ────────────────────────────────────────
  return (
    <div className="page-container" style={{ background:'#1a0e05', position:'relative' }}>
      <StarBg />

      {/* XP Popups */}
      {xpPopups.map(p => (
        <div key={p.id} className="xp-popup" style={{ left:p.x, top:p.y }}>
          +{p.amount} XP ⭐
        </div>
      ))}

      {/* Boot screen */}
      {booting && (
        <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', position:'relative', zIndex:1 }}>
          <WoodPanel>
            <div style={{ fontSize:28, color:'#ffd700' }}>Loading AlgoQuest...</div>
          </WoodPanel>
        </div>
      )}

      {/* Global error banner */}
      {!booting && appError && page !== 'login' && (
        <div style={{ position:'fixed', top:16, left:'50%', transform:'translateX(-50%)', width:'min(520px, calc(100% - 32px))', zIndex:3 }}>
          <FeedbackBanner msg={appError} type="error" />
        </div>
      )}

      {/* Page Router */}
      {!booting && page === 'login' && (
        <LoginPage onLogin={handleLogin} initialError={appError} />
      )}

      {!booting && page === 'dashboard' && user && (
        <Dashboard user={user} onNavigate={p => setPage(p)} onLogout={handleLogout} />
      )}

      {!booting && page === 'worlds' && user && (
        <WorldsPage
          user={user}
          onSelectGame={handleSelectGame}
          onBack={() => setPage('dashboard')}
          onLogout={handleLogout}
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
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}
