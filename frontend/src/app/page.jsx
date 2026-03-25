'use client';
// The full AlgoQuest game is in the AlgoQuest.jsx component
// In Next.js, import and use the component directly
import dynamic from 'next/dynamic';
const AlgoQuest = dynamic(() => import('../components/AlgoQuest'), { ssr: false });
export default function Home() { return <AlgoQuest />; }
