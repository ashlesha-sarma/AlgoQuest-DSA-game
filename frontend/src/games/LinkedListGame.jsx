import { useState } from "react";
import { WoodPanel, Parchment, PxBtn, FeedbackBanner, SPRITE_C } from "../components/ui";

/* ═══════════════════════════════════════════════
   GAME 3 — REVERSE LINKED LIST
═══════════════════════════════════════════════ */
export default function LinkedListGame({ onComplete, addXP }) {
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
              <div key={`${animKey}-${idx}`} className="anim-appear" style={{ animationDelay: `${idx*0.06}s`, display:'flex', alignItems:'center' }}>
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
