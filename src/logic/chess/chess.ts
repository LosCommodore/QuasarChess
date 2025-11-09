export type PieceType = 'k' | 'q' | 'r' | 'b' | 'n' | 'p' | '';
export type Position = [number, number];

export interface Piece {
  type: PieceType;
  color: 'b' | 'w';
  id: string;
}

type DirectionFunction = (a: number, b: number) => [number, number];

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

  /**
   *  returns [OK, STOP]
   *  OK: allowed to move here
   *  STOP: direction exhaused
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
    const one = (a: number, b: number): [number, number] => [++a, b];
    const two = (a: number, b: number): [number, number] => [--a, b];
    const three = (a: number, b: number): [number, number] => [a, ++b];
    const four = (a: number, b: number): [number, number] => [a, --b];
    const allowed: [number, number][] = this.get_movements(y0, x0, self_color, [
      one,
      two,
      three,
      four,
    ]);

    return allowed;
  }

  private get_bishop_movement(y0: number, x0: number, self_color: string): [number, number][] {
    const one = (a: number, b: number): [number, number] => [++a, ++b];
    const two = (a: number, b: number): [number, number] => [++a, --b];
    const three = (a: number, b: number): [number, number] => [--a, ++b];
    const four = (a: number, b: number): [number, number] => [--a, --b];
    const allowed: [number, number][] = this.get_movements(y0, x0, self_color, [
      one,
      two,
      three,
      four,
    ]);

    return allowed;
  }

  private get_queen_movement(y0: number, x0: number, self_color: string): [number, number][] {
    const allowed_rook = this.get_rock_movement(y0, x0, self_color);
    const allowed_bishop = this.get_bishop_movement(y0, x0, self_color);

    return [...allowed_bishop, ...allowed_rook];
  }

  /** get movements for rook, bishop, queen
   * @param y0 starting position of piece
   * @param x0 starting position of piece
   * @param self_color color of piece
   * @param directions list of direction functions
   * @returns allowed positions
   */
  private get_movements(
    y0: number,
    x0: number,
    self_color: string,
    directions: DirectionFunction[],
  ): [number, number][] {
    let x = x0;
    let y = y0;
    const allowed: [number, number][] = [];
    for (const direction of directions) {
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

  private get_king_movement(y0: number, x0: number, self_color: string): [number, number][] {
    const movements: [number, number][] = [
      [y0 + 1, x0],
      [y0 - 1, x0],
      [y0, x0 + 1],
      [y0, x0 - 1],
      [y0 + 1, x0 - 1],
      [y0 - 1, x0 + 1],
      [y0 - 1, x0 - 1],
      [y0 + 1, x0 + 1],
    ];
    const allowed: [number, number][] = [];

    for (const m of movements) {
      const [ok, _stop] = this.process_pos(...m, self_color);
      if (ok) {
        allowed.push(m);
      }
    }

    return allowed;
  }

  private get_pawn_movement(y0: number, x0: number, self_color: string): [number, number][] {
    // TODO: implement en passant

    let x = x0;
    const direction = self_color === 'b' ? 1 : -1;
    const y = y0 + direction;
    const allowed: [number, number][] = [];

    if (y < 0 || y > 7) {
      return [];
    }

    let foreign_id = this.board[y]?.[x] as string;
    if (foreign_id === '') allowed.push([y, x]);

    for (x of [x0 + 1, x0 - 1]) {
      if (x > 7 || x < 0) continue;
      foreign_id = this.board[y]?.[x] as string;
      if (foreign_id != '') {
        const foreign_piece = id_to_piece(foreign_id);
        if (foreign_piece.color != self_color) allowed.push([y, x]);
      }
    }
    return allowed;
  }

  private get_knight_movement(y0: number, x0: number, self_color: string): [number, number][] {
    const allowed: [number, number][] = [];
    let destinations: [number, number][] = [
      [y0 + 2, x0 + 1],
      [y0 - 2, x0 + 1],
      [y0 + 2, x0 - 1],
      [y0 - 2, x0 - 1],
      [y0 + 1, x0 + 2],
      [y0 + 1, x0 - 2],
      [y0 - 1, x0 + 2],
      [y0 - 1, x0 - 2],
    ];
    destinations = destinations.filter(([a, b]) => a > 0 && a <= 7 && b > 0 && b <= 7);
    for (const d of destinations) {
      const foreign_id = this.board[d[0]]?.[d[1]] as string;
      if (foreign_id === '') allowed.push(d);
      else {
        const foreign_piece = id_to_piece(foreign_id);
        if (foreign_piece.color != self_color) allowed.push(d);
      }
    }

    return allowed;
  }

  public get_movement_options(pos: [number, number]): [number, number][] {
    const id = this.board[pos[0]]?.[pos[1]] as string;
    if (id === '') throw new Error('No piece on this position');
    const piece = id_to_piece(id);

    const mapping: Record<
      string,
      (y0: number, x0: number, self_color: string) => [number, number][]
    > = {
      r: this.get_rock_movement.bind(this),
      b: this.get_bishop_movement.bind(this),
      q: this.get_queen_movement.bind(this),
      k: this.get_king_movement.bind(this),
      p: this.get_pawn_movement.bind(this),
      n: this.get_knight_movement.bind(this),
    };

    const fun = mapping[piece.type] as (
      y0: number,
      x0: number,
      self_color: string,
    ) => [number, number][];

    const allowed = fun(...pos, piece.color);
    return allowed;
  }
}
