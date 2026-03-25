import { Inter } from 'next/font/google';
import './globals.css';

export const metadata = {
  title: 'AlgoQuest — Gamified DSA Learning',
  description: 'Learn Data Structures & Algorithms through pixel art adventures!',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=VT323&display=swap" rel="stylesheet" />
      </head>
      <body style={{ fontFamily: "'VT323', monospace", background: '#1a0e05', margin: 0 }}>
        {children}
      </body>
    </html>
  );
}
