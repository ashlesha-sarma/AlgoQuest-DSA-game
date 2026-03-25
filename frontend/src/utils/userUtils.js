/* ═══════════════════════════════════════════════
   USER UTILITIES
═══════════════════════════════════════════════ */
export function normalizeUser(user) {
  if (!user) return null;

  return {
    ...user,
    name: user.name || 'Adventurer',
    completed: Array.isArray(user.completed) ? user.completed : [],
    xp: user.xp ?? 0,
    currentWorld: user.currentWorld ?? 1,
  };
}

/* ═══════════════════════════════════════════════
   GAME DATA — WORLDS + PROBLEMS
═══════════════════════════════════════════════ */
export const WORLDS = [
  {
    id:'arrays', name:'Arrays Kingdom', icon:'🏰', color:'#2e7d32', accent:'#4caf50',
    desc:'Master sorting and windowing in the fertile fields of Array-ia.',
    problems:[
      { id:'bubble', title:'Bubble Sort Path', type:'bubble', diff:'easy',  xp:10, desc:'Guide your farmer through the harvest path by sorting the crops!' },
      { id:'window', title:'Sliding Window Quest', type:'window', diff:'medium', xp:20, desc:'Expand and shrink the harvest window to collect the longest unique crop run!' },
    ],
  },
  {
    id:'pointers', name:'Pointer Forest', icon:'🌲', color:'#4e342e', accent:'#a1887f',
    desc:'Navigate tangled vines of linked nodes deep in the enchanted forest.',
    problems:[
      { id:'linked', title:'Reverse the River', type:'linked', diff:'medium', xp:20, desc:'Reverse the flow of the enchanted river — flip every pointer!' },
    ],
  },
  {
    id:'graphs', name:'Graph Dungeon', icon:'🗺️', color:'#0d47a1', accent:'#1976d2',
    desc:'Explore the labyrinthine dungeon using Breadth-First Search.',
    problems:[
      { id:'bfs', title:'BFS Labyrinth', type:'bfs', diff:'medium', xp:20, desc:'Visit every chamber in the correct BFS order to escape the dungeon!' },
    ],
  },
  {
    id:'stacks', name:'Stack Tower', icon:'🗼', color:'#7f0000', accent:'#e53935',
    desc:'Catch falling brackets and match them in the ancient Stack Tower.',
    problems:[
      { id:'parens', title:'Bracket Guardian', type:'parens', diff:'hard', xp:30, desc:'Push and pop brackets onto the magic stack — match every pair!' },
    ],
  },
];
