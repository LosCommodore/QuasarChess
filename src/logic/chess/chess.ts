export type PieceType = 'k' | 'q' | 'r' | 'b' | 'n' | 'p' | '';

export interface Piece {
  type: PieceType;
  color: 'b' | 'w';
}

export class Board {
  private pieces: Map<string, Piece>;

  constructor() {
    this.pieces = new Map();
  }

  set_piece(y: number, x: number, piece: Piece) {
    const key = `${y},${x}`;
    this.pieces.set(key, piece);
  }

  get_piece(y: number, x: number): Piece | undefined {
    const key = `${y},${x}`;
    return this.pieces.get(key);
  }

  get_pieces_list(): [[number, number], Piece][] {
    const result = [];
    for (const [pos, piece] of this.pieces) {
      const postion = pos.split(',');
      const y = Number(postion[0]);
      const x = Number(postion[1]);
      const item: [[number, number], Piece] = [[y, x], piece];
      result.push(item);
    }
    return result;
  }
}
