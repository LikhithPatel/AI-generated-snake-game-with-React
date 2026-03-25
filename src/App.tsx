/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { motion } from 'motion/react';
import { Gamepad2, Music, Zap } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-cyan-500/30 overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-fuchsia-500/10 blur-[120px] rounded-full animate-pulse delay-700" />
        <div className="absolute top-[20%] right-[10%] w-[20%] h-[20%] bg-blue-500/5 blur-[80px] rounded-full animate-pulse delay-1000" />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <main className="relative z-10 container mx-auto px-4 py-8 min-h-screen flex flex-col items-center justify-center gap-12">
        {/* Header Section */}
        <header className="text-center space-y-4">
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono tracking-widest uppercase"
          >
            <Zap className="w-3 h-3 fill-current" />
            <span>System Online</span>
          </motion.div>
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-2"
          >
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter italic bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]">
              NEON BEATS
            </h1>
            <p className="text-cyan-400/60 font-mono text-sm tracking-[0.3em] uppercase">
              Retro Gaming • Cyber Vibes • Lo-Fi Beats
            </p>
          </motion.div>
        </header>

        {/* Main Content Grid */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] items-center gap-12 max-w-7xl">
          {/* Left Sidebar - Info/Stats */}
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="hidden lg:flex flex-col gap-6"
          >
            <div className="p-6 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 space-y-4">
              <div className="flex items-center gap-3 text-cyan-400">
                <Gamepad2 className="w-5 h-5" />
                <h2 className="font-bold tracking-tight uppercase">Controls</h2>
              </div>
              <ul className="space-y-3 text-sm text-white/60 font-mono">
                <li className="flex justify-between border-b border-white/5 pb-2">
                  <span>Move</span>
                  <span className="text-cyan-400">Arrows</span>
                </li>
                <li className="flex justify-between border-b border-white/5 pb-2">
                  <span>Pause</span>
                  <span className="text-cyan-400">Space</span>
                </li>
                <li className="flex justify-between border-b border-white/5 pb-2">
                  <span>Reset</span>
                  <span className="text-cyan-400">R Key</span>
                </li>
              </ul>
            </div>

            <div className="p-6 bg-fuchsia-500/5 backdrop-blur-md rounded-3xl border border-fuchsia-500/10 space-y-4">
              <div className="flex items-center gap-3 text-fuchsia-400">
                <Music className="w-5 h-5" />
                <h2 className="font-bold tracking-tight uppercase">Playlist</h2>
              </div>
              <div className="space-y-2">
                {['Neon Dreams', 'Midnight Drive', 'Digital Pulse'].map((track, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group">
                    <div className="w-8 h-8 rounded-lg bg-fuchsia-500/20 flex items-center justify-center text-xs font-mono text-fuchsia-400 group-hover:bg-fuchsia-500 group-hover:text-black transition-all">
                      0{i+1}
                    </div>
                    <span className="text-sm text-white/40 group-hover:text-white/80 transition-colors">{track}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Center - Snake Game */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <SnakeGame />
          </motion.div>

          {/* Right Sidebar - Music Player */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex justify-center"
          >
            <MusicPlayer />
          </motion.div>
        </div>

        {/* Footer */}
        <footer className="mt-auto pt-12 text-white/20 text-[10px] font-mono tracking-[0.5em] uppercase text-center">
          Terminal v2.5.0 • Built for the Grid
        </footer>
      </main>
    </div>
  );
}



