// types.ts
export interface Cell {
  id: number;
  hasMine: boolean;
  revealed: boolean;
}

export interface GameState {
  grid: Cell[];
  mines: number[];
  multiplier: number;
  bet: number;
  gameOver: boolean;
  winnings: number;
}
