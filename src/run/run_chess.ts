import { Board } from 'src/logic/chess/chess';

const board = new Board();
board.board[2]![3] = 'r';
console.log(board.toString());
