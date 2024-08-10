import { Mark } from "~/enums/mark.enum";
import { Result } from "~/enums/result.enum";
import { Database } from "~/types/supabase.types";

type BoardType = Database["public"]["Tables"]["rooms"]["Row"]["board"];
type MarkType = Database["public"]["Enums"]["mark"];

const isWinner = (mark: MarkType, board: BoardType) =>
  board.some((lines) => lines.every((line) => line === mark));

const getDiagonalLines = (board: BoardType) => {
  const diagonalLines = [];
  const equalBasedDiagonal = []; /* row === col */
  const sumBasedDiagonal = []; /* row + col === board.length - 1 */

  /* left to right [\] */
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board.length; col++) {
      if (row === col) {
        equalBasedDiagonal.push(board[row][col]);
      }
    }
  }

  /* right to left [/] */
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board.length; col++) {
      if (row + col === board.length - 1) {
        sumBasedDiagonal.push(board[row][col]);
      }
    }
  }

  diagonalLines.push(equalBasedDiagonal, sumBasedDiagonal);

  return diagonalLines as BoardType;
};

const isHorizontalWinner = (mark: MarkType, board: BoardType) =>
  isWinner(mark, board);

const rotate = (
  matrix: BoardType,
  direction: "clockwise" | "counterClockwise" = "clockwise"
) => {
  const n = matrix.length;
  return matrix[0].map((_, colIndex) =>
    matrix
      .map((row) => row[n - colIndex - 1])
      [direction === "clockwise" ? "reverse" : "slice"]()
  );
};

const isVerticalWinner = (mark: MarkType, board: BoardType) =>
  isWinner(mark, rotate(board));

const isDiagonalWinner = (mark: MarkType, board: BoardType) =>
  isWinner(mark, getDiagonalLines(board));

const getWinner = (mark: MarkType, board: BoardType) => {
  return (
    isHorizontalWinner(mark, board) ||
    isVerticalWinner(mark, board) ||
    isDiagonalWinner(mark, board)
  );
};

const isTie = (board: BoardType) => {
  const isBoardFull = () =>
    board.every((row) => row.every((square) => !!square));

  return (
    !getWinner(Mark.X, board) && !getWinner(Mark.O, board) && isBoardFull()
  );
};

export const getResult = (turn: MarkType, board: BoardType) => {
  if (isTie(board)) {
    return Result.TIE;
  }

  if (getWinner(turn, board)) {
    return turn;
  }
};

const createBoardWithFilledRowAtIndex = (rowIndex: number, mark: MarkType) => {
  const matrix = Array.from({ length: 3 }, () => Array(3).fill(null));
  matrix[rowIndex] = Array(3).fill(mark);
  return matrix;
};

export const getWinningLine = (winner: MarkType, board: BoardType) => {
  if (isHorizontalWinner(winner, board)) {
    let lineRow = null;

    board.forEach((row, index) => {
      if (row.every((square) => square === winner)) {
        lineRow = index;
      }
    });

    if (lineRow === null) return null;

    return createBoardWithFilledRowAtIndex(lineRow, winner);
  }

  if (isVerticalWinner(winner, board)) {
    let lineRow = null;

    rotate(board).forEach((row, index) => {
      if (row.every((square) => square === winner)) {
        lineRow = index;
      }
    });

    if (lineRow === null) return null;

    return rotate(createBoardWithFilledRowAtIndex(lineRow, winner));
  }

  if (isDiagonalWinner(winner, board)) {
    const lines = getDiagonalLines(board);

    let line = [
      [winner, null, null],
      [null, winner, null],
      [null, null, winner],
    ];

    if (lines[0].every((item) => item === winner)) {
      return line;
    } else if (lines[1].every((item) => item === winner)) {
      return rotate(line as string[][], "counterClockwise");
    } else {
      return null;
    }
  }

  return null;
};
