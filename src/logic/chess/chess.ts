export type Piece = 'k' | 'q' | 'r' | 'b' | 'n' | 'p' | '';

export class Board {
  board: Piece[][];

  constructor() {
    this.board = Array.from({ length: 8 }, () => new Array(8).fill(''));
  }

  toString(): string {
    const draw = this.board.map((v) => v.join('.')).join('\n');
    return draw;
  }
}
