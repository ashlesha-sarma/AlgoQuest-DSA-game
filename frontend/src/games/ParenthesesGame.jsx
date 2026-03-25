import { useState } from "react";
import { WoodPanel, Parchment, PxBtn, FeedbackBanner, SPRITE_C } from "../components/ui";

/* ═══════════════════════════════════════════════
   GAME 5 — VALID PARENTHESES (STACK GAME)
═══════════════════════════════════════════════ */
export default function ParenthesesGame({ onComplete, addXP }) {
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
                ⬆ POP &amp; MATCH
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
