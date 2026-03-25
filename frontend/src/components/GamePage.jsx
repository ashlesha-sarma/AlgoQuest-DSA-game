import { WoodPanel, PxBtn, SPRITE_C } from "./ui";
import BubbleSortGame    from "../games/BubbleSortGame";
import SlidingWindowGame from "../games/SlidingWindowGame";
import LinkedListGame    from "../games/LinkedListGame";
import BFSGame           from "../games/BFSGame";
import ParenthesesGame   from "../games/ParenthesesGame";

/* ═══════════════════════════════════════════════
   GAME PAGE (CONTAINER)
═══════════════════════════════════════════════ */
export default function GamePage({ user, world, problem, onComplete, onBack, addXP, onLogout }) {
  const handleComplete = () => onComplete(problem);

  const GAME_MAP = {
    bubble: BubbleSortGame,
    window: SlidingWindowGame,
    linked: LinkedListGame,
    bfs:    BFSGame,
    parens: ParenthesesGame,
  };
  const GameComp = GAME_MAP[problem.type];

  return (
    <div style={{ minHeight:'100vh', padding:16, position:'relative', zIndex:1 }}>
      {/* Header */}
      <WoodPanel style={{ marginBottom:16, display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:10 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <span style={{ fontSize:28 }}>{world.icon}</span>
          <div>
            <div style={{ fontSize:22, color:SPRITE_C[6] }}>{problem.title}</div>
            <div style={{ fontSize:16, color:'#d7ccc8' }}>{world.name}</div>
          </div>
          <span className={`badge-${problem.diff}`} style={{ marginLeft:8 }}>{problem.diff}</span>
          <span style={{ padding:'2px 8px', border:'2px solid #ffd700', background:'rgba(255,215,0,.15)', color:SPRITE_C[6], fontSize:15, borderRadius:2, fontFamily:"'VT323',monospace" }}>
            +{problem.xp} XP
          </span>
          {user.completed.includes(problem.id) && <span className="badge-done" style={{ marginLeft:4 }}>✓ DONE</span>}
        </div>
        <div style={{ display:'flex', gap:10, alignItems:'center' }}>
          <div style={{ fontSize:18, color:SPRITE_C[6] }}>⭐ {user.xp} XP</div>
          <PxBtn variant="brn" onClick={onBack}>← Map</PxBtn>
          <PxBtn variant="red" size="sm" onClick={onLogout}>🚪 Logout</PxBtn>
        </div>
      </WoodPanel>

      <div style={{ maxWidth:900, margin:'0 auto' }}>
        {GameComp ? (
          <GameComp onComplete={handleComplete} addXP={addXP} />
        ) : (
          <WoodPanel><div style={{ fontSize:24, color:'#ef9a9a' }}>Game not found: {problem.type}</div></WoodPanel>
        )}
      </div>
    </div>
  );
}
