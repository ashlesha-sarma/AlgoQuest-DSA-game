import { WoodPanel, Parchment, PxBtn, ProgBar, TreeLogo, Divider, SPRITE_C } from "./ui";
import { WORLDS } from "../utils/userUtils";

/* ═══════════════════════════════════════════════
   DASHBOARD
═══════════════════════════════════════════════ */
export default function Dashboard({ user, onNavigate, onLogout }) {
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
    <div style={{ height:'100%', padding:'12px', position:'relative', zIndex:1, display:'flex', flexDirection:'column' }}>
      {/* Top nav */}
      <WoodPanel style={{ marginBottom:16, display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:10 }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <TreeLogo size={120} />
          <div>
            <div style={{ fontSize:42, color:SPRITE_C[6], lineHeight:1 }}>AlgoQuest</div>
            <div style={{ fontSize:22, color:'#d7ccc8' }}>Welcome, {user.name}!</div>
          </div>
        </div>
        <div style={{ display:'flex', gap:12, alignItems:'center' }}>
          <div style={{ textAlign:'right' }}>
            <div style={{ fontSize:18, color:SPRITE_C[6] }}>⭐ {user.xp} XP</div>
           
          </div>
          <PxBtn variant="grn" onClick={() => onNavigate('worlds')}>🗺️ Play!</PxBtn>
          <PxBtn variant="red" size="sm" onClick={onLogout}>🚪 Logout</PxBtn>
        </div>
      </WoodPanel>

      {/* Layer 1: Progress */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:10, maxWidth:1100, margin:'0 auto', width:'100%', marginBottom:16 }}>
        {/* XP & Progress */}
        <WoodPanel style={{ boxShadow:'0 0 0 3px #4e342e', border:'none', padding:10 }}>
          <Parchment>
            <div style={{ fontSize:22, marginBottom:8 }}>⭐ XP Progress</div>
            <div style={{ fontSize:36, color:'#5d4037', marginBottom:4 }}>{user.xp} /100 XP</div>
            <ProgBar value={currentXP} max={xpForLevel} />
          </Parchment>
        </WoodPanel>

        {/* Problems completed */}
        <WoodPanel style={{ boxShadow:'0 0 0 3px #4e342e', border:'none', padding:10 }}>
          <Parchment>
            <div style={{ fontSize:22, marginBottom:8 }}>📋 Problems</div>
            <div style={{ fontSize:48, color:'#5d4037' }}>{completedCount}<span style={{ fontSize:24 }}>/{totalProblems}</span></div>
            <ProgBar value={completedCount} max={totalProblems} />
            <div style={{ fontSize:16, marginTop:6, color:'#5d4037' }}>
              {totalProblems - completedCount > 0 ? `${totalProblems - completedCount} remaining` : '🎉 All complete!'}
            </div>
          </Parchment>
        </WoodPanel>
      </div>

      {/* Layer 2: Algorithm Tip */}
      <div style={{ maxWidth:1100, margin:'0 auto 16px', width:'100%' }}>
        <WoodPanel style={{ boxShadow:'0 0 0 3px #4e342e', border:'none', padding:10 }}>
          <Parchment>
            <div style={{ fontSize:22, marginBottom:6 }}>💡 Algorithm Tip</div>
            <div style={{ fontSize:20, color:'#5d4037' }}>{tip}</div>
          </Parchment>
        </WoodPanel>
      </div>

      <div style={{ flex:1 }} />

      {/* Layer 3: Worlds */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:12, maxWidth:1100, margin:'0 auto 60px', width:'100%' }}>
        {/* World quick-links */}
        {WORLDS.map(world => {
          const done = world.problems.every(p => user.completed.includes(p.id));
          return (
            <div key={world.id}
              onClick={() => onNavigate('worlds')}
              style={{
                cursor:'pointer', padding:3,
                background: `linear-gradient(135deg, ${world.color}66, ${world.color}33)`,
                border:`3px solid ${world.color}`,
                borderRadius:4, transition:'transform .2s',
              }}
              onMouseOver={e => e.currentTarget.style.transform='scale(1.05)'}
              onMouseOut={e => e.currentTarget.style.transform='scale(1)'}
            >
              <WoodPanel style={{ background:'transparent', boxShadow:'none', border:'none', padding:14, textAlign:'center' }}>
                <div style={{ fontSize:42 }}>{world.icon}</div>
                <div style={{ fontSize:22, color:SPRITE_C[6], marginBottom:4 }}>{world.name}</div>
                <div style={{ fontSize:15, color:'#d7ccc8' }}>
                  {world.problems.filter(p => user.completed.includes(p.id)).length}/{world.problems.length} done
                </div>
                {done && <div className="badge-done" style={{ marginTop:6, display:'inline-block' }}>✓ CLEAR</div>}
              </WoodPanel>
            </div>
          );
        })}
      </div>
    </div>
  );
}
