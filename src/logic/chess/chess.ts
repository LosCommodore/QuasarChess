export type PieceType = 'k' | 'q' | 'r' | 'b' | 'n' | 'p' | '';
export type Position = [number, number];

export interface Piece {
  type: PieceType;
  color: 'b' | 'w';
}

export function get_allowed_rook(y: number, x: number): Position[] {
  const pos = [];
  for (let i = 0; i < 8; i++) {
    pos.push([x, i] as Position);
  }
  for (let i = 0; i < 8; i++) {
    pos.push([i, y] as Position);
  }
  return pos;
}
