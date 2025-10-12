export type PieceType = 'k' | 'q' | 'r' | 'b' | 'n' | 'p' | '';

export type Position = [number, number];

export interface Piece {
  type: PieceType;
  color: 'b' | 'w';
}
