import { useState } from "react";
import { WoodPanel, Parchment, PxBtn, FeedbackBanner, SPRITE_C } from "../components/ui";

/* ═══════════════════════════════════════════════
   GAME 2 — SLIDING WINDOW
═══════════════════════════════════════════════ */
export default function SlidingWindowGame({ onComplete, addXP }) {
  const ARR = [2, 1, 5, 2, 3, 2, 1, 4];
  const ANSWER = 4; // longest = [1,5,2,3] length 4

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
