export type PieceType = 'k' | 'q' | 'r' | 'b' | 'n' | 'p' | '';
export type Position = [number, number];

export interface Piece {
  type: PieceType;
  color: 'b' | 'w';
  id: string;
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
