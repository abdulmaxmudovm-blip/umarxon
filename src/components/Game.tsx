import React, { useEffect, useRef, useState } from 'react';
import { CarBrand, Obstacle } from '../types';

interface GameProps {
  selectedCar: CarBrand;
  onGameOver: (score: number) => void;
}

const ROAD_WIDTH = 300;
const CAR_WIDTH = 50;
const CAR_HEIGHT = 80;

export const Game: React.FC<GameProps> = ({ selectedCar, onGameOver }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const carPos = useRef({ x: ROAD_WIDTH / 2 - CAR_WIDTH / 2, y: 0 }); // y is fixed from bottom
  const obstacles = useRef<Obstacle[]>([]);
  const frameRef = useRef<number>(0);
  const startTime = useRef<number>(Date.now());
  const speed = useRef(5);

  // Input handling
  const keys = useRef<{ [key: string]: boolean }>({});

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => keys.current[e.key] = true;
    const handleKeyUp = (e: KeyboardEvent) => keys.current[e.key] = false;
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const update = () => {
      // Move car
      if (keys.current['ArrowLeft'] && carPos.current.x > 0) {
        carPos.current.x -= 7;
      }
      if (keys.current['ArrowRight'] && carPos.current.x < ROAD_WIDTH - CAR_WIDTH) {
        carPos.current.x += 7;
      }

      // Update speed over time
      const elapsed = (Date.now() - startTime.current) / 1000;
      speed.current = 5 + Math.floor(elapsed / 10) * 1.5;

      // Spawn obstacles
      if (Math.random() < 0.02) {
        obstacles.current.push({
          id: Math.random(),
          x: Math.random() * (ROAD_WIDTH - CAR_WIDTH),
          y: -100,
          speed: speed.current + (Math.random() * 2)
        });
      }

      // Move obstacles
      obstacles.current.forEach(obs => obs.y += obs.speed);

      // Check collision
      const carRect = { x: carPos.current.x, y: canvas.height - CAR_HEIGHT - 20, w: CAR_WIDTH, h: CAR_HEIGHT };
      for (const obs of obstacles.current) {
        if (
          carRect.x < obs.x + CAR_WIDTH &&
          carRect.x + carRect.w > obs.x &&
          carRect.y < obs.y + CAR_HEIGHT &&
          carRect.y + carRect.h > obs.y
        ) {
          onGameOver(Math.floor(elapsed * 10));
          return;
        }
      }

      // Remove off-screen obstacles
      obstacles.current = obstacles.current.filter(obs => obs.y < canvas.height);

      // Update score
      setScore(Math.floor(elapsed * 10));

      // Draw
      draw();
      frameRef.current = requestAnimationFrame(update);
    };

    const draw = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Road background (dark asphalt)
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Motion blur effect for road lines
      const lineSpeed = speed.current * 2;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.setLineDash([30, 60]);
      ctx.lineDashOffset = -(Date.now() / 2) % 90;
      ctx.lineWidth = 4;

      // Draw 3 lanes
      for (let i = 1; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo((canvas.width / 3) * i, 0);
        ctx.lineTo((canvas.width / 3) * i, canvas.height);
        ctx.stroke();
      }

      // Side lines
      ctx.setLineDash([]);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.strokeRect(5, 0, canvas.width - 10, canvas.height);

      // Draw obstacles (Other cars)
      ctx.fillStyle = '#ff4444';
      obstacles.current.forEach(obs => {
        // Draw car shape
        ctx.fillRect(obs.x, obs.y, CAR_WIDTH, CAR_HEIGHT);
        // Lights
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(obs.x + 5, obs.y + CAR_HEIGHT - 5, 10, 5);
        ctx.fillRect(obs.x + CAR_WIDTH - 15, obs.y + CAR_HEIGHT - 5, 10, 5);
        ctx.fillStyle = '#ff4444'; // reset
      });

      // Draw Player Car
      const px = carPos.current.x;
      const py = canvas.height - CAR_HEIGHT - 20;
      
      // Car Shadow
      ctx.shadowBlur = 15;
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      
      // Body
      ctx.fillStyle = selectedCar === 'BMW' ? '#0066b1' : '#ffffff';
      ctx.beginPath();
      ctx.roundRect(px, py, CAR_WIDTH, CAR_HEIGHT, 8);
      ctx.fill();

      ctx.shadowBlur = 0;

      // Details
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.fillRect(px + 5, py + 15, CAR_WIDTH - 10, 15); // Windshield
      ctx.fillRect(px + 5, py + CAR_HEIGHT - 25, CAR_WIDTH - 10, 10); // Rear window

      // Headlights (Neon)
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#fff';
      ctx.fillStyle = '#fff';
      ctx.fillRect(px + 5, py + 5, 12, 6);
      ctx.fillRect(px + CAR_WIDTH - 17, py + 5, 12, 6);
      ctx.shadowBlur = 0;

      // Brand color stripes
      if (selectedCar === 'BMW') {
        ctx.fillStyle = '#0066b1';
        ctx.fillRect(px + CAR_WIDTH/2 - 2, py, 4, CAR_HEIGHT);
      }
    };

    frameRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frameRef.current);
  }, [selectedCar, onGameOver]);

  return (
    <div className="relative flex flex-col items-center">
      <div className="absolute top-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
        <div className="font-display text-4xl font-bold tracking-widest text-white/50">
          {score.toString().padStart(6, '0')}
        </div>
        <div className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-display tracking-widest uppercase text-white/40">
          {Math.floor(speed.current * 10)} km/h
        </div>
      </div>
      <canvas
        ref={canvasRef}
        width={ROAD_WIDTH}
        height={600}
        className="rounded-xl border border-white/10 shadow-2xl shadow-indigo-500/10"
      />
      <div className="mt-8 flex gap-4 text-white/40 font-display text-sm tracking-tighter uppercase">
        <span>← Chapga</span>
        <span>|</span>
        <span>O'ngga →</span>
      </div>
    </div>
  );
};
