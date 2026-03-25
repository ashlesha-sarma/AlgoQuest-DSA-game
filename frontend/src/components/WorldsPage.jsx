import { WoodPanel, PxBtn, SPRITE_C } from "./ui";
import { WORLDS } from "../utils/userUtils";

/* ═══════════════════════════════════════════════
   WORLDS PAGE
═══════════════════════════════════════════════ */
export default function WorldsPage({ user, onSelectGame, onBack, onLogout }) {
  const isWorldUnlocked = (worldIdx) => {
    if (worldIdx === 0) return true;
    const prevWorld = WORLDS[worldIdx - 1];
    return prevWorld.problems.every(p => user.completed.includes(p.id));
  };

  return (
    <div style={{ height:'100%', padding:'12px', position:'relative', zIndex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
      <WoodPanel style={{ marginBottom:12, display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:8, flexShrink:0 }}>
        <div style={{ fontSize:24, color:SPRITE_C[6] }}>🗺️ World Map</div>
        <div style={{ display:'flex', gap:8, alignItems:'center' }}>
          <div style={{ fontSize:18, color:SPRITE_C[6] }}>⭐ {user.xp} XP</div>
          <PxBtn variant="brn" size="sm" onClick={onBack}>← Dashboard</PxBtn>
          <PxBtn variant="red" size="sm" onClick={onLogout}>🚪 Logout</PxBtn>
        </div>
      </WoodPanel>

      <div style={{ maxWidth:900, margin:'0 auto', width:'100%', flex:1, overflowY:'auto', paddingRight:4, scrollbarWidth:'none', msOverflowStyle:'none' }}>
        <style>{`div::-webkit-scrollbar { display: none; }`}</style>
        {WORLDS.map((world, wi) => {
          const unlocked = isWorldUnlocked(wi);
          return (
            <div key={world.id} style={{ marginBottom:12 }}>
              {/* World header */}
              <div style={{
                padding:'8px 14px', marginBottom:8,
                background: unlocked ? `linear-gradient(90deg, ${world.color}, ${world.accent}44)` : '#3e2723',
                border:`3px solid ${unlocked ? world.accent : '#5d4037'}`,
                borderRadius:3,
                boxShadow:`0 3px 0 ${unlocked ? world.color : '#2d1b0e'}`,
                display:'flex', justifyContent:'space-between', alignItems:'center',
              }}>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <span style={{ fontSize:30 }}>{world.icon}</span>
                  <div>
                    <div style={{ fontSize:22, color:SPRITE_C[6] }}>{world.name}</div>
                    <div style={{ fontSize:14, color:'#d7ccc8' }}>{world.desc}</div>
                  </div>
                </div>
                {!unlocked && <span style={{ fontSize:20 }}>🔒</span>}
                {unlocked && (
                  <div style={{ fontSize:14, color:'#a5d6a7' }}>
                    {world.problems.filter(p => user.completed.includes(p.id)).length}/{world.problems.length} ✓
                  </div>
                )}
              </div>

              {/* Problems */}
              <div style={{ display:'flex', flexDirection:'column', gap:8, paddingLeft:16 }}>
                {world.problems.map((prob) => {
                  const isComplete = user.completed.includes(prob.id);
                  const locked = !unlocked;
                  return (
                    <div key={prob.id} style={{
                      display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:8,
                      padding:'8px 12px',
                      background: isComplete ? 'rgba(76,175,80,.1)' : locked ? 'rgba(62,39,35,.4)' : 'rgba(93,64,37,.2)',
                      border:`3px solid ${isComplete ? '#4caf50' : locked ? '#3e2723' : '#5d4037'}`,
                      borderRadius:2, cursor: locked ? 'not-allowed' : 'pointer',
                      transition:'transform .1s',
                    }}
                      onMouseOver={e => { if (!locked) e.currentTarget.style.transform='scale(1.005)'; }}
                      onMouseOut={e => e.currentTarget.style.transform='scale(1)'}
                      onClick={() => { if (!locked) onSelectGame(world, prob); }}
                    >
                      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <div style={{ fontSize:22 }}>{isComplete ? '✅' : locked ? '🔒' : '▶'}</div>
                        <div>
                          <div style={{ fontSize:18, color:SPRITE_C[6] }}>{prob.title}</div>
                        </div>
                      </div>
                      <div style={{ display:'flex', gap:6, alignItems:'center' }}>
                        <span className={`badge-${prob.diff}`} style={{ fontSize:13 }}>{prob.diff.toUpperCase()}</span>
                        <span style={{
                          padding:'1px 8px', border:'2px solid #ffd700',
                          background:'rgba(255,215,0,.15)', color:SPRITE_C[6], fontSize:14,
                          borderRadius:2, fontFamily:"'VT323',monospace",
                        }}>+{prob.xp} XP</span>
                        {isComplete && <span className="badge-done" style={{ fontSize:13 }}>DONE</span>}
                        {!locked && !isComplete && (
                          <PxBtn variant="grn" size="sm" style={{ padding:'3px 8px', fontSize:14 }} onClick={e => { e.stopPropagation(); onSelectGame(world, prob); }}>
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
