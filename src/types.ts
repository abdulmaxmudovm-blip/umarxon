export type CarBrand = 'BMW' | 'Mercedes';

export interface GameState {
  score: number;
  isGameOver: boolean;
  isStarted: boolean;
  selectedCar: CarBrand;
}

export interface Position {
  x: number;
  y: number;
}

export interface Obstacle {
  id: number;
  x: number;
  y: number;
  speed: number;
}
