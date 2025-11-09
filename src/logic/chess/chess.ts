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

export class Board {
  private board: string[][];

  constructor() {
    this.board = Array.from({ length: 8 }, () => Array.from({ length: 8 }, () => ''));
  }

  piece_positions(): [Position, Piece][] {
    const ret: [Position, Piece][] = [];
    for (const [y, row] of this.board.entries()) {
      for (const [x, p] of row.entries()) {
        if (p != '') {
          const piece = id_to_piece(p);
          ret.push([[y, x], piece]);
        }
      }
    }
    return ret;
  }

  add_piece(piece_id: string, pos: [number, number]) {
    for (const v of pos) if (v < 0 || v > 7) throw new Error('Position outside board');

    const current = this.board[pos[0]]?.[pos[1]] as string;
    if (current != '') throw new Error('Already a piece on this position');

    const row = this.board[pos[0]] as string[];
    row[pos[1]] = piece_id;
  }

  /*
  returns [OK, STOP]
  OK: allowed to move here
  STOP: direction exhaused
  */
  private process_pos(y: number, x: number, self_color: string): [boolean, boolean] {
    if (y < 0 || y > 7 || x < 0 || x > 7) {
      return [false, true];
    }
    const foreign_id = this.board[y]?.[x] as string;

    if (foreign_id === '') {
      return [true, false];
    }

    const foreign_piece = id_to_piece(foreign_id);
    return [foreign_piece.color != self_color, true];
  }

  private get_rock_movement(y0: number, x0: number, self_color: string): [number, number][] {
    const allowed: [number, number][] = [];

    for (let y = y0 + 1; y < 8; y++) {
      const [ok, stop] = this.process_pos(y, x0, self_color);
      if (ok) allowed.push([y, x0]);
      if (stop) break;
    }

    for (let y = y0 - 1; y >= 0; y--) {
      const [ok, stop] = this.process_pos(y, x0, self_color);
      if (ok) allowed.push([y, x0]);
      if (stop) break;
    }

    for (let x = x0 + 1; x < 8; x++) {
      const [ok, stop] = this.process_pos(y0, x, self_color);
      if (ok) allowed.push([y0, x]);
      if (stop) break;
    }

    for (let x = x0 - 1; x >= 0; x--) {
      const [ok, stop] = this.process_pos(y0, x, self_color);
      if (ok) allowed.push([y0, x]);
      if (stop) break;
    }

    return allowed;
  }

  public get_bishop_movement(y0: number, x0: number, self_color: string): [number, number][] {
    const one = (a: number, b: number): [number, number] => {
      const pos: [number, number] = [++a, ++b];
      return pos;
    };
    const two = (a: number, b: number): [number, number] => {
      const pos: [number, number] = [++a, --b];
      return pos;
    };
    const three = (a: number, b: number): [number, number] => {
      const pos: [number, number] = [--a, ++b];
      return pos;
    };
    const four = (a: number, b: number): [number, number] => {
      const pos: [number, number] = [--a, --b];
      return pos;
    };

    let x = x0;
    let y = y0;
    const allowed: [number, number][] = [];
    for (const direction of [one, two, three, four]) {
      x = x0;
      y = y0;
      while (true) {
        [x, y] = direction(x, y);
        const [ok, stop] = this.process_pos(y, x, self_color);
        if (ok) allowed.push([y, x]);
        if (stop) {
          break;
        }
      }
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
      case 'b':
        {
          allowed = this.get_bishop_movement(y0, x0, piece.color);
        }
        break;

      default: {
        throw new Error('Panic!');
      }
    }

    return allowed;
  }
}
