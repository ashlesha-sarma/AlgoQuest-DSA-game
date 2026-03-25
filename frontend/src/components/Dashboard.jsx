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
          <TreeLogo size={80} />
          <div>
            <div style={{ fontSize:26, color:SPRITE_C[6] }}>AlgoQuest</div>
            <div style={{ fontSize:16, color:'#d7ccc8' }}>Welcome, {user.name}!</div>
          </div>
        </div>
        <div style={{ display:'flex', gap:12, alignItems:'center' }}>
          <div style={{ textAlign:'right' }}>
            <div style={{ fontSize:18, color:SPRITE_C[6] }}>⭐ {user.xp} XP</div>
            <div style={{ fontSize:16, color:'#d7ccc8' }}>Level {Math.floor(user.xp / xpForLevel) + 1}</div>
          </div>
          <PxBtn variant="grn" onClick={() => onNavigate('worlds')}>🗺️ Play!</PxBtn>
          <PxBtn variant="red" size="sm" onClick={onLogout}>🚪 Logout</PxBtn>
        </div>
      </WoodPanel>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:10, maxWidth:1000, margin:'0 auto', flex:1 }}>
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
