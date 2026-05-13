/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, ChevronRight, Play, RefreshCw, Car } from 'lucide-react';
import { Game } from './components/Game';
import { CarBrand, GameState } from './types';

export default function App() {
  const [state, setState] = useState<GameState>({
    score: 0,
    isGameOver: false,
    isStarted: false,
    selectedCar: 'BMW',
  });

  const [highScore, setHighScore] = useState(
    Number(localStorage.getItem('highScore')) || 0
  );

  useEffect(() => {
    if (state.score > highScore) {
      setHighScore(state.score);
      localStorage.setItem('highScore', String(state.score));
    }
  }, [state.score, highScore]);

  const startGame = () => setState(s => ({ ...s, isStarted: true, isGameOver: false, score: 0 }));
  const handleGameOver = (finalScore: number) => {
    setState(s => ({ ...s, isGameOver: true, score: finalScore }));
  };
  const restart = () => setState(s => ({ ...s, isGameOver: false, isStarted: false }));

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans overflow-hidden flex flex-col relative">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-10 filter blur-sm scale-110"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1605152276897-4f618f83196c?q=80&w=2000&auto=format&fit=crop")' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-blue-900/5 to-black" />
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #3b82f6 0%, transparent 70%)' }}></div>
      </div>

      <header className="relative z-20 flex items-center justify-between p-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center font-black italic border-2 border-white/20 shadow-[0_0_20px_rgba(59,130,246,0.5)]">R</div>
          <div>
            <h1 className="text-xl font-black italic tracking-tighter uppercase leading-none">Hyper<span className="text-blue-500">Drive</span></h1>
            <p className="text-[10px] text-zinc-500 font-bold tracking-widest uppercase">Ultimate Racing Sim</p>
          </div>
        </div>
        
        <div className="flex gap-6">
          <div className="bg-zinc-900/80 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-yellow-400 shadow-[0_0_8px_#facc15]"></div>
            <span className="font-mono font-bold text-sm">{highScore.toLocaleString()} CR</span>
          </div>
          <div className="bg-zinc-900/80 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_8px_#60a5fa]"></div>
            <span className="font-mono font-bold uppercase text-[10px] tracking-wider">Rank Elite</span>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {!state.isStarted && !state.isGameOver && (
            <motion.div
              key="menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 w-full flex flex-col items-center justify-center relative"
            >
              {/* Stats Panel (Left Side) */}
              <div className="absolute left-10 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-10 z-20">
                <div className="space-y-1">
                  <p className="text-blue-400 text-xs font-bold uppercase tracking-[0.2em]">Selected Model</p>
                  <h2 className="text-7xl font-black italic uppercase tracking-tighter tabular-nums leading-none">
                    {state.selectedCar === 'BMW' ? 'BMW M5' : 'AMG GT'}
                  </h2>
                  <p className="text-2xl text-zinc-400 font-light italic">Competition Edition</p>
                </div>
                
                <div className="grid grid-cols-1 gap-6 w-72">
                  {[
                    { label: 'Speed', value: state.selectedCar === 'BMW' ? '315 KM/H' : '310 KM/H', progress: '85%' },
                    { label: 'Acceleration', value: state.selectedCar === 'BMW' ? '3.4S' : '3.8S', progress: '92%' },
                    { label: 'Handling', value: state.selectedCar === 'BMW' ? 'Pro Grade' : 'Ultra', progress: '78%' },
                  ].map((stat) => (
                    <div key={stat.label} className="space-y-2">
                      <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                        <span>{stat.label}</span>
                        <span className="text-zinc-300">{stat.value}</span>
                      </div>
                      <div className="h-1.5 bg-zinc-800/50 rounded-full overflow-hidden border border-white/5">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: stat.progress }}
                          className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Car Selection Buttons (Bottom Left) */}
              <div className="absolute bottom-10 left-10 flex gap-4 z-20">
                {[
                  { id: 'BMW' as CarBrand, color: '#0066b1', label: 'M5' },
                  { id: 'Mercedes' as CarBrand, color: '#ffffff', label: 'GT' }
                ].map((item) => (
                  <button 
                    key={item.id}
                    onClick={() => setState(s => ({ ...s, selectedCar: item.id }))}
                    className={`w-16 h-16 rounded-2xl bg-white/5 border flex flex-col items-center justify-center hover:bg-white/10 transition-all ${
                      state.selectedCar === item.id ? 'border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'border-white/10'
                    }`}
                  >
                    <span className="text-[10px] uppercase font-bold text-zinc-500 mb-1">{item.label}</span>
                    <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: item.color }}></div>
                  </button>
                ))}
              </div>

              {/* Central Visual */}
              <div className="relative w-full max-w-4xl flex items-center justify-center pointer-events-none">
                <div className="absolute w-[600px] h-[100px] bg-blue-600/20 blur-[120px] bottom-10"></div>
                <motion.div
                  key={state.selectedCar}
                  initial={{ x: 100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ type: "spring", damping: 20 }}
                  className="w-full aspect-video relative flex items-center justify-center"
                >
                  <img 
                    src={state.selectedCar === 'BMW' 
                      ? "https://images.unsplash.com/photo-1555215695-3004980ad951?q=80&w=1200"
                      : "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=1200"
                    }
                    className="w-[80%] h-auto rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)] border border-white/10"
                    alt="Luxury Car"
                    referrerPolicy="no-referrer"
                  />
                </motion.div>
              </div>

              {/* Start Button (Bottom Right) */}
              <div className="absolute bottom-10 right-10 z-20">
                <button 
                  onClick={startGame}
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-blue-600 blur-2xl opacity-40 group-hover:opacity-70 transition-opacity"></div>
                  <div className="relative bg-blue-600 hover:bg-blue-500 px-12 py-6 rounded-2xl font-black italic text-2xl tracking-tighter uppercase flex items-center gap-4 border-t border-white/30 transition-all active:scale-95 shadow-2xl">
                    Start Race
                    <ChevronRight size={24} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              </div>
            </motion.div>
          )}

          {state.isStarted && !state.isGameOver && (
            <motion.div
              key="game"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="flex-1 flex flex-col items-center justify-center"
            >
              <Game selectedCar={state.selectedCar} onGameOver={handleGameOver} />
            </motion.div>
          )}

          {state.isGameOver && (
            <motion.div
              key="gameover"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-1 flex flex-col items-center justify-center text-center p-8"
            >
              <div className="p-10 bg-zinc-900/80 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] space-y-8 max-w-lg w-full shadow-2xl">
                <div className="space-y-2">
                  <p className="text-zinc-500 font-bold uppercase tracking-[0.3em] text-xs">Poyga yakunlandi</p>
                  <h2 className="text-6xl font-black italic tracking-tighter italic uppercase text-blue-500">Krasher!</h2>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                    <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-2">Distance</p>
                    <p className="text-4xl font-display font-bold tabular-nums italic text-white">{state.score}<span className="text-sm ml-1 opacity-50">m</span></p>
                  </div>
                  <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                    <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-2">Personal Best</p>
                    <p className="text-4xl font-display font-bold tabular-nums italic text-white">{highScore}<span className="text-sm ml-1 opacity-50">m</span></p>
                  </div>
                </div>

                <button
                  onClick={restart}
                  className="w-full relative group"
                >
                  <div className="absolute inset-0 bg-blue-600 blur-xl opacity-30"></div>
                  <div className="relative w-full flex items-center justify-center gap-3 bg-white text-black py-5 rounded-2xl font-black italic text-xl uppercase hover:bg-zinc-100 transition-colors">
                    <RefreshCw size={20} strokeWidth={3} />
                    Try Again
                  </div>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="relative z-20 p-8 flex items-center justify-between border-t border-white/5 bg-zinc-950/80 backdrop-blur-xl">
        <div className="flex gap-12">
          {[
            { label: 'Engine', value: '3.0L TWIN-TURBO' },
            { label: 'Drivetrain', value: 'AWD PERFORMANCE' },
            { label: 'Tires', value: 'PIREL-X SPORT' }
          ].map((spec) => (
            <div key={spec.label} className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-1">{spec.label}</span>
              <span className="text-xs font-bold tracking-tight text-zinc-300">{spec.value}</span>
            </div>
          ))}
        </div>
        
        <div className="flex items-center gap-4 text-zinc-500 text-[10px] font-bold">
          <span className="px-2 py-1 bg-zinc-800 border border-white/5 rounded uppercase">Left</span>
          <span className="px-2 py-1 bg-zinc-800 border border-white/5 rounded uppercase">Right</span>
          <span className="ml-2 uppercase tracking-[0.2em] text-zinc-500/60">Hold arrows to steer</span>
        </div>
      </footer>
    </div>
  );
}

