import { useState } from "react";
import { WoodPanel, Parchment, PxBtn, FeedbackBanner, PlayerCharacter, SPRITE_C } from "../components/ui";

/* ═══════════════════════════════════════════════
   GAME 4 — BFS TRAVERSAL
═══════════════════════════════════════════════ */
export default function BFSGame({ onComplete, addXP }) {
  // Graph: 7 nodes, BFS from 0 → correct order: 0,1,2,3,4,5,6
  const GRAPH = {
    nodes: [
      { id:0, label:'A', x:180, y:50  },
      { id:1, label:'B', x:80,  y:150 },
      { id:2, label:'C', x:290, y:150 },
      { id:3, label:'D', x:30,  y:260 },
      { id:4, label:'E', x:140, y:260 },
      { id:5, label:'F', x:230, y:260 },
      { id:6, label:'G', x:330, y:260 },
    ],
    edges: [[0,1],[0,2],[1,3],[1,4],[2,5],[2,6]],
    adj:   { 0:[1,2], 1:[0,3,4], 2:[0,5,6], 3:[1], 4:[1], 5:[2], 6:[2] },
  };
  const BFS_ORDER = [0,1,2,3,4,5,6];

  const [visited, setVisited]   = useState([]);
  const [queue, setQueue]       = useState([0]);
  const [step, setStep]         = useState(0);
  const [done, setDone]         = useState(false);
  const [feedback, setFeedback] = useState({ msg:'Click node A to start BFS! Select nodes in the correct BFS order.', type:'info' });
  const [shake, setShake]       = useState(false);
  const [history, setHistory]   = useState([]);

  const nextExpected = BFS_ORDER[step];

  const visitNode = (nodeId) => {
    if (done || visited.includes(nodeId)) return;
    if (nodeId !== nextExpected) {
      setShake(true); setTimeout(() => setShake(false), 400);
      const exp = GRAPH.nodes.find(n => n.id === nextExpected);
      setFeedback({ msg:`❌ Wrong! Visit node ${exp.label} next (BFS processes queue front first).`, type:'error' });
      return;
    }
    const node = GRAPH.nodes.find(n => n.id === nodeId);
    const newVisited = [...visited, nodeId];
    const neighbors = GRAPH.adj[nodeId].filter(n => !newVisited.includes(n) && !queue.slice(1).includes(n));
    const newQueue = [...queue.slice(1), ...neighbors];
    setVisited(newVisited); setQueue(newQueue);
    setHistory(h => [...h, node.label]); setStep(s => s + 1);

    if (newVisited.length === GRAPH.nodes.length) {
      setDone(true); addXP(20, 400, 300);
      setFeedback({ msg:'🎉 All nodes visited in perfect BFS order! +20 XP!', type:'success' });
    } else {
      setFeedback({ msg:`✅ Visited ${node.label}! Queue: [${newQueue.map(n => GRAPH.nodes[n].label).join(' → ')}]`, type:'success' });
    }
  };

  const reset = () => {
    setVisited([]); setQueue([0]); setStep(0); setDone(false); setHistory([]);
    setFeedback({ msg:'Click node A to start BFS!', type:'info' });
  };

  const SVG_W = 380, SVG_H = 320;

  return (
    <div className={shake ? 'anim-scrnshk' : ''}>
      <WoodPanel style={{ marginBottom:16 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:8 }}>
          <div>
            <div style={{ fontSize:24, color:SPRITE_C[6] }}>🗺️ BFS Labyrinth</div>
            <div style={{ fontSize:16, color:'#d7ccc8' }}>Visited: {visited.length}/{GRAPH.nodes.length} · Step: {step}</div>
          </div>
          <div style={{ display:'flex', gap:8 }}>
            <PxBtn variant="brn" size="sm" onClick={reset}>↺ Reset</PxBtn>
            {done && <PxBtn variant="grn" onClick={onComplete}>Next Level →</PxBtn>}
          </div>
        </div>
      </WoodPanel>

      <Parchment style={{ marginBottom:16 }}>
        <div style={{ fontSize:18, color:'#5d4037' }}>
          <strong>BFS Rule:</strong> Always visit the node at the <em>front</em> of the queue next.
          Neighbors get added to the <em>back</em>. Level by level exploration!
        </div>
      </Parchment>

      <div style={{ display:'flex', gap:16, flexWrap:'wrap', marginBottom:16 }}>
        {/* Graph SVG */}
        <WoodPanel style={{ flex:'1 1 360px', minWidth:300 }}>
          <div style={{ fontSize:18, color:SPRITE_C[6], marginBottom:8 }}>📊 Graph — click the correct node!</div>
          <svg width="100%" viewBox={`0 0 ${SVG_W} ${SVG_H}`} style={{ display:'block', maxHeight:320 }}>
            {/* Edges */}
            {GRAPH.edges.map(([a,b],i) => {
              const na = GRAPH.nodes[a], nb = GRAPH.nodes[b];
              const bothVisited = visited.includes(a) && visited.includes(b);
              return (
                <line key={i}
                  x1={na.x+28} y1={na.y+28} x2={nb.x+28} y2={nb.y+28}
                  stroke={bothVisited ? '#4caf50' : '#8d6e63'} strokeWidth={bothVisited ? 3 : 2}
                  strokeDasharray={bothVisited ? '0' : '4,3'}
                />
              );
            })}
            {/* Nodes */}
            {GRAPH.nodes.map(node => {
              const isVisited  = visited.includes(node.id);
              const inQueue    = queue.includes(node.id);
              const isCurrent  = visited.length > 0 && visited[visited.length-1] === node.id;
              const isNext     = node.id === nextExpected && !done;
              return (
                <g key={node.id} style={{ cursor: isVisited ? 'default' : 'pointer' }} onClick={() => visitNode(node.id)}>
                  <circle cx={node.x+28} cy={node.y+28} r={26}
                    fill={isVisited ? '#4caf50' : inQueue ? '#fff9c4' : '#d7ccc8'}
                    stroke={isNext ? '#ffd700' : isVisited ? '#2e7d32' : '#5d4037'}
                    strokeWidth={isNext ? 4 : 3}
                    style={{ filter: isNext ? 'drop-shadow(0 0 8px #ffd700)' : isCurrent ? 'drop-shadow(0 0 10px #ff9800)' : 'none' }}
                  />
                  <text x={node.x+28} y={node.y+35}
                    textAnchor="middle"
                    fill={isVisited ? '#fff' : '#3e2723'}
                    fontSize={22} fontFamily="'VT323',monospace"
                  >{node.label}</text>
                  {isNext && (
                    <text x={node.x+28} y={node.y+12} textAnchor="middle" fill="#ffd700" fontSize={14} fontFamily="'VT323',monospace">★next</text>
                  )}
                  {isCurrent && (
                    <foreignObject x={node.x + 3} y={node.y - 45} width={50} height={50}>
                      <div className="anim-float">
                        <PlayerCharacter size={50} />
                      </div>
                    </foreignObject>
                  )}
                </g>
              );
            })}
          </svg>
        </WoodPanel>

        {/* Queue + History panel */}
        <div style={{ flex:'0 0 200px', display:'flex', flexDirection:'column', gap:12 }}>
          {/* Queue */}
          <WoodPanel>
            <div style={{ fontSize:18, color:SPRITE_C[6], marginBottom:8 }}>📋 Queue</div>
            {queue.length === 0 && !done ? (
              <div style={{ fontSize:16, color:'#8d6e63' }}>empty</div>
            ) : done ? (
              <div style={{ fontSize:16, color:'#a5d6a7' }}>done!</div>
            ) : (
              queue.map((nid, qi) => {
                const n = GRAPH.nodes[nid];
                return (
                  <div key={qi} style={{
                    padding:'4px 10px', marginBottom:4, border:'2px solid',
                    borderColor: qi===0 ? '#ffd700' : '#5d4037',
                    background: qi===0 ? 'rgba(255,215,0,.2)' : 'rgba(93,64,37,.2)',
                    borderRadius:2, fontSize:18, color:SPRITE_C[6],
                    fontFamily:"'VT323',monospace",
                  }}>
                    {qi===0 ? '→ ' : '  '}{n.label}
                  </div>
                );
              })
            )}
          </WoodPanel>
          {/* Visit History */}
          <WoodPanel>
            <div style={{ fontSize:18, color:SPRITE_C[6], marginBottom:8 }}>🏃 Visited</div>
            <div style={{ fontSize:20, color:'#a5d6a7', fontFamily:"'VT323',monospace", letterSpacing:2 }}>
              {history.length > 0 ? history.join(' → ') : '—'}
            </div>
          </WoodPanel>
        </div>
      </div>

      <WoodPanel>
        {feedback && <FeedbackBanner msg={feedback.msg} type={feedback.type} />}
      </WoodPanel>
    </div>
  );
}
