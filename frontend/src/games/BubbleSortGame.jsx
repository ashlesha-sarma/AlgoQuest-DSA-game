import { useState } from "react";
import { WoodPanel, Parchment, PxBtn, FeedbackBanner, PlayerCharacter, SPRITE_C } from "../components/ui";

/* ═══════════════════════════════════════════════
   GAME 1 — BUBBLE SORT
═══════════════════════════════════════════════ */
export default function BubbleSortGame({ onComplete, addXP }) {
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
            <div style={{ fontSize:16, color:'#d7ccc8' }}>Pass {i+1} of {n-1} · Comparing positions {j} &amp; {j+1} · Swaps: {swapCount}</div>
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
              <div style={{ height:104, overflow:'visible', display:'flex', alignItems:'flex-end', justifyContent:'center' }}>
                {idx === j && !done && (
                  <div className="anim-walk">
                    <PlayerCharacter size={96} flip={playerFlip} />
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
