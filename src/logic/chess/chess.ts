export type PieceType = 'k' | 'q' | 'r' | 'b' | 'n' | 'p' | '';
export type Position = [number, number];

export interface Piece {
  type: PieceType;
  color: 'b' | 'w';
  id: string;
}

function id_to_piece(id: string): Piece {
  const color = id[0] as string;
  const type = id[1] as string;
  return { type, color, id } as Piece;
}

function create_pieces(color: 'b' | 'w'): Piece[] {
  const pieces: Piece[] = [
    { type: 'k', color: color, id: `${color}k` },
    { type: 'q', color: color, id: `${color}q` },
  ];

  const items: [PieceType, number][] = [
    ['r', 2],
    ['b', 2],
    ['n', 2],
    ['p', 8],
  ];

  for (const [t, nr] of items) {
    for (let i = 0; i < nr; i++) {
      pieces.push({
        type: t,
        color: color,
        id: `${color}${t}${i}`,
      });
    }
  }
  return pieces;
}

function create_all_pieces(): Record<string, Piece> {
  const cols: ('b' | 'w')[] = ['b', 'w'];
  const p = cols.flatMap((x) => create_pieces(x));
  const m = Object.fromEntries(p.map((x) => [x.id, x]));
  return m;
}

const pieces = create_all_pieces();
export { pieces };

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

class Board {
  private board: string[][];

  constructor() {
    this.board = Array.from({ length: 8 }, () => Array.from({ length: 8 }, () => ''));
  }

  add_piece(piece_id: string, pos: [number, number]) {
    for (const v of pos) if (v < 0 || v > 7) throw new Error('Position outside board');

    const current = this.board[pos[0]]?.[pos[1]] as string;
    if (current != '') throw new Error('Already a piece on this position');

    const row = this.board[pos[0]] as string[];
    row[pos[1]] = piece_id;
  }

  get_rock_movement(y0: number, x0: number, self_color: string): [number, number][] {
    const allowed: [number, number][] = [];

    const process_pos = (y: number, x: number): boolean => {
      const foreign_id = this.board[y]?.[x] as string;

      if (foreign_id === '') {
        allowed.push([y, x0]);
        return true;
      }

      const foreign_piece = id_to_piece(foreign_id);
      if (foreign_piece.color != self_color) allowed.push([y, x0]);
      return false;
    };

    for (let y = y0; y < 8; y++) {
      if (!process_pos(y, x0)) break;
    }
    for (let y = y0; y > 0; y--) {
      if (!process_pos(y, x0)) break;
    }
    for (let x = x0; x < 8; x++) {
      if (!process_pos(y0, x)) break;
    }
    for (let x = x0; x > 0; x--) {
      if (!process_pos(y0, x)) break;
    }

    return allowed;
  }

  get_movement_options(pos: [number, number]): [number, number][] {
    const [y0, x0] = pos;
    const id = this.board[pos[0]]?.[pos[1]] as string;
    if (id === '') throw new Error('No piece on this position');
    const piece = id_to_piece(id);

    let allowed = [];
    switch (piece.type) {
      case 'r':
        {
          allowed = this.get_rock_movement(y0, x0, piece.color);
        }
        break;
      default: {
        throw new Error('Panic!');
      }
    }

    return allowed;
  }
}
