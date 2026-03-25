import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music, Disc } from 'lucide-react';
import { Track } from '../types';
import { motion, AnimatePresence } from 'motion/react';

const DUMMY_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Neon Dreams',
    artist: 'Cyber Synth',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    cover: 'https://picsum.photos/seed/neon/400/400'
  },
  {
    id: '2',
    title: 'Midnight Drive',
    artist: 'Retro Wave',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    cover: 'https://picsum.photos/seed/drive/400/400'
  },
  {
    id: '3',
    title: 'Digital Pulse',
    artist: 'Future Bass',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    cover: 'https://picsum.photos/seed/pulse/400/400'
  }
];

export const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Playback failed", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleEnded = () => {
    handleNext();
  };

  return (
    <div className="w-full max-w-md bg-black/40 backdrop-blur-xl rounded-3xl border border-fuchsia-500/30 p-6 flex flex-col gap-6 shadow-[0_0_50px_-12px_rgba(217,70,239,0.5)]">
      <div className="flex items-center gap-4">
        <div className="relative group">
          <motion.div
            animate={{ rotate: isPlaying ? 360 : 0 }}
            transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
            className="w-20 h-20 rounded-full overflow-hidden border-2 border-fuchsia-500/50 shadow-[0_0_20px_rgba(217,70,239,0.3)]"
          >
            <img 
              src={currentTrack.cover} 
              alt={currentTrack.title} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </motion.div>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-4 h-4 bg-black rounded-full border border-fuchsia-500/50" />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-fuchsia-400 font-bold text-lg truncate tracking-tight">{currentTrack.title}</h3>
          <p className="text-fuchsia-400/60 text-sm font-medium truncate">{currentTrack.artist}</p>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex gap-1">
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  animate={{ height: isPlaying ? [4, 12, 4] : 4 }}
                  transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
                  className="w-1 bg-fuchsia-500 rounded-full"
                />
              ))}
            </div>
            <span className="text-[10px] text-fuchsia-500/40 font-mono uppercase tracking-widest">Now Playing</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="h-1.5 w-full bg-fuchsia-900/30 rounded-full overflow-hidden border border-fuchsia-500/10">
          <motion.div 
            className="h-full bg-fuchsia-500 shadow-[0_0_10px_rgba(217,70,239,0.8)]"
            animate={{ width: `${progress}%` }}
            transition={{ type: 'spring', bounce: 0, duration: 0.1 }}
          />
        </div>
        <div className="flex justify-between text-[10px] font-mono text-fuchsia-500/40">
          <span>0:00</span>
          <span>3:45</span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-8">
        <button 
          onClick={handlePrev}
          className="p-2 text-fuchsia-400/60 hover:text-fuchsia-400 transition-colors hover:scale-110 active:scale-95"
        >
          <SkipBack className="w-6 h-6 fill-current" />
        </button>
        
        <button 
          onClick={togglePlay}
          className="w-14 h-14 flex items-center justify-center bg-fuchsia-500 text-white rounded-full shadow-[0_0_20px_rgba(217,70,239,0.5)] hover:bg-fuchsia-400 transition-all hover:scale-105 active:scale-95"
        >
          {isPlaying ? (
            <Pause className="w-6 h-6 fill-current" />
          ) : (
            <Play className="w-6 h-6 fill-current ml-1" />
          )}
        </button>

        <button 
          onClick={handleNext}
          className="p-2 text-fuchsia-400/60 hover:text-fuchsia-400 transition-colors hover:scale-110 active:scale-95"
        >
          <SkipForward className="w-6 h-6 fill-current" />
        </button>
      </div>

      <div className="flex items-center gap-3 px-4 py-2 bg-fuchsia-500/5 rounded-full border border-fuchsia-500/10">
        <Volume2 className="w-4 h-4 text-fuchsia-500/40" />
        <div className="flex-1 h-1 bg-fuchsia-900/30 rounded-full overflow-hidden">
          <div className="w-2/3 h-full bg-fuchsia-500/40" />
        </div>
      </div>

      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />
    </div>
  );
};


