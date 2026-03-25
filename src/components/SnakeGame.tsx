import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Point, Direction } from '../types';
import { Trophy, RotateCcw, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Direction = 'UP';
const INITIAL_SPEED = 150;

export const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const gameLoopRef = useRef<number | null>(null);

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isOnSnake = currentSnake.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      );
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setIsGameOver(false);
    setScore(0);
    setFood(generateFood(INITIAL_SNAKE));
    setIsPaused(false);
  };

  const moveSnake = useCallback(() => {
    if (isGameOver || isPaused) return;

    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const newHead = { ...head };

      switch (direction) {
        case 'UP': newHead.y -= 1; break;
        case 'DOWN': newHead.y += 1; break;
        case 'LEFT': newHead.x -= 1; break;
        case 'RIGHT': newHead.x += 1; break;
      }

      // Check collisions
      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE ||
        prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)
      ) {
        setIsGameOver(true);
        setIsPaused(true);
        if (score > highScore) setHighScore(score);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((s) => s + 10);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, isGameOver, isPaused, score, highScore, generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction !== 'DOWN') setDirection('UP'); break;
        case 'ArrowDown': if (direction !== 'UP') setDirection('DOWN'); break;
        case 'ArrowLeft': if (direction !== 'RIGHT') setDirection('LEFT'); break;
        case 'ArrowRight': if (direction !== 'LEFT') setDirection('RIGHT'); break;
        case ' ': setIsPaused((p) => !p); break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    const interval = setInterval(moveSnake, INITIAL_SPEED);
    return () => clearInterval(interval);
  }, [moveSnake]);

  return (
    <div className="flex flex-col items-center gap-6 p-8 bg-black/40 backdrop-blur-xl rounded-3xl border border-cyan-500/30 shadow-[0_0_50px_-12px_rgba(6,182,212,0.5)]">
      <div className="flex justify-between w-full px-4">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-400" />
          <span className="text-cyan-400 font-mono text-xl tracking-tighter">SCORE: {score}</span>
        </div>
        <div className="text-cyan-400/50 font-mono text-xl tracking-tighter">BEST: {highScore}</div>
      </div>

      <div 
        className="relative bg-black/60 rounded-xl overflow-hidden border-2 border-cyan-500/20 shadow-inner"
        style={{ 
          width: GRID_SIZE * 20, 
          height: GRID_SIZE * 20,
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`
        }}
      >
        {/* Grid lines */}
        <div className="absolute inset-0 grid grid-cols-20 grid-rows-20 opacity-5 pointer-events-none">
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => (
            <div key={i} className="border-[0.5px] border-cyan-500" />
          ))}
        </div>

        {/* Snake */}
        {snake.map((segment, i) => (
          <motion.div
            key={`${i}-${segment.x}-${segment.y}`}
            initial={false}
            animate={{ x: segment.x * 20, y: segment.y * 20 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className="absolute w-5 h-5 p-[1px]"
          >
            <div 
              className={`w-full h-full rounded-sm ${
                i === 0 
                  ? 'bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]' 
                  : 'bg-cyan-600/80'
              }`} 
            />
          </motion.div>
        ))}

        {/* Food */}
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.8, 1, 0.8]
          }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="absolute w-5 h-5 p-1"
          style={{ left: food.x * 20, top: food.y * 20 }}
        >
          <div className="w-full h-full bg-fuchsia-500 rounded-full shadow-[0_0_15px_rgba(217,70,239,0.8)]" />
        </motion.div>

        {/* Overlays */}
        <AnimatePresence>
          {(isGameOver || isPaused) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4 z-10"
            >
              {isGameOver ? (
                <>
                  <h2 className="text-4xl font-bold text-fuchsia-500 tracking-tighter italic">GAME OVER</h2>
                  <button
                    onClick={resetGame}
                    className="flex items-center gap-2 px-6 py-3 bg-cyan-500 text-black font-bold rounded-full hover:bg-cyan-400 transition-colors shadow-[0_0_20px_rgba(6,182,212,0.5)]"
                  >
                    <RotateCcw className="w-5 h-5" />
                    TRY AGAIN
                  </button>
                </>
              ) : (
                <>
                  <h2 className="text-4xl font-bold text-cyan-400 tracking-tighter italic">PAUSED</h2>
                  <button
                    onClick={() => setIsPaused(false)}
                    className="flex items-center gap-2 px-6 py-3 bg-fuchsia-500 text-white font-bold rounded-full hover:bg-fuchsia-400 transition-colors shadow-[0_0_20px_rgba(217,70,239,0.5)]"
                  >
                    <Play className="w-5 h-5 fill-current" />
                    RESUME
                  </button>
                  <p className="text-cyan-400/60 text-sm font-mono">PRESS SPACE TO PLAY</p>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex gap-4 text-xs font-mono text-cyan-400/40 uppercase tracking-widest">
        <span>Use Arrows to move</span>
        <span>•</span>
        <span>Space to pause</span>
      </div>
    </div>
  );
};


