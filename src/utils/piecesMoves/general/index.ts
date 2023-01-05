import { Move, PieceColor, TableType } from "../../../models/basicTypes";
import { letters } from "../constants";
import { getPawnProcessedMoves } from "../pawnMoves";
import { getBishopProcessedMoves } from "../bishopMoves";

export const getPieceColor = (piece: string): PieceColor => {
  return piece === piece.toUpperCase() ? "white" : "black";
};

const getPositionFromSquareName = (sqName: string) => {
  const [letter, number] = sqName.split("");
  const letterIndex = letters.indexOf(letter);
  const numberIndex = 8 - parseInt(number);
  return [letterIndex, numberIndex];
};

export const getPieceFromSquare = (
  table: TableType,
  sqName: string
): string | null => {
  const [letterIndex, numberIndex] = getPositionFromSquareName(sqName);
  return table[numberIndex][letterIndex];
};

export const getPieceColorFromSquare = (
  table: TableType,
  sqName: string
): PieceColor | null => {
  const piece = getPieceFromSquare(table, sqName);
  if (!piece) return null;
  return getPieceColor(piece);
};

export const getSquareInFront = (sqName: string, color: PieceColor) => {
  const [letter, number] = sqName.split("");
  if (
    (color === "white" && number === "8") ||
    (color === "black" && number === "1")
  )
    return null;
  return letter + (parseInt(number) + (color === "white" ? 1 : -1));
};

export const getSquareInBack = (sqName: string, color: PieceColor) => {
  const [letter, number] = sqName.split("");
  if (
    (color === "white" && number === "1") ||
    (color === "black" && number === "8")
  )
    return null;
  return letter + (parseInt(number) - (color === "white" ? 1 : -1));
};

export const getSquareInRight = (sqName: string) => {
  const [letter, number] = sqName.split("");
  const letterIndex = letters.indexOf(letter);
  if (letterIndex === 7) return null;
  return letters[letterIndex + 1] + number;
};

export const getSquareInLeft = (sqName: string) => {
  const [letter, number] = sqName.split("");
  const letterIndex = letters.indexOf(letter);
  if (letterIndex === 0) return null;
  return letters[letterIndex - 1] + number;
};

export const getSquareInRightFront = (sqName: string, color: PieceColor) => {
  const rightSquare = getSquareInRight(sqName);
  if (!rightSquare) return null;
  return getSquareInFront(rightSquare, color);
};

export const getSquareInLeftFront = (sqName: string, color: PieceColor) => {
  const leftSquare = getSquareInLeft(sqName);
  if (!leftSquare) return null;
  return getSquareInFront(leftSquare, color);
};

export const getSquareInRightBack = (sqName: string, color: PieceColor) => {
  const rightSquare = getSquareInRight(sqName);
  if (!rightSquare) return null;
  return getSquareInBack(rightSquare, color);
};

export const getSquareInLeftBack = (sqName: string, color: PieceColor) => {
  const leftSquare = getSquareInLeft(sqName);
  if (!leftSquare) return null;
  return getSquareInBack(leftSquare, color);
};

export const getSquareName = (letterIndex: number, numberIndex: number) => {
  const letter = letters[letterIndex];
  const number = 8 - numberIndex;
  return letter + number;
};

export const getTableAfterMove = (table: TableType, move: Move) => {
  console.log("getTableAfterMove", move);
  const piece = getPieceFromSquare(table, move.from);
  const piecePosition = getPositionFromSquareName(move.from);
  const position = getPositionFromSquareName(move.to);
  const newTable = table.map((row) => row.map((cell) => cell));
  newTable[piecePosition[1]][piecePosition[0]] = null;
  newTable[position[1]][position[0]] = piece;
  if (move.flag === "enPassant") {
    const eatenPiecePosition = getPositionFromSquareName(
      getSquareInBack(move.to, getPieceColor(piece!)!)!
    );
    newTable[eatenPiecePosition[1]][eatenPiecePosition[0]] = null;
  }
  console.log("newTable", newTable);
  return newTable;
};

export const getPossibleMoves = (
  table: TableType,
  sqName: string,
  moves: Move[]
): Move[] => {
  const possibleMoves: Move[] = [];

  const piece = getPieceFromSquare(table, sqName);
  if (!piece) {
    return possibleMoves;
  }
  const pieceColor = getPieceColor(piece);

  if (["p", "P"].includes(piece)) {
    return getPawnProcessedMoves(sqName, table, moves);
  }
  if (["b", "B"].includes(piece)) {
    return getBishopProcessedMoves(sqName, table, moves);
  }

  // table.forEach((row, i) => {
  //   row.forEach((cell, j) => {
  //     const squareName = getSquareName(j, i);
  //     if (squareName !== sqName) {
  //       possibleMoves.push(squareName);
  //     }
  //   });
  // });
  return possibleMoves;
};

export const fenToTable = (fen: string): TableType => {
  const rows = fen.split("/");
  const table = rows.map((r) => {
    const squares = r.split("");
    return squares.map((s) => {
      const isLetter = s.toLowerCase() !== s.toUpperCase();
      return isLetter
        ? s
        : Array.from(Array(parseInt(s)).keys()).map(() => null);
    });
  });
  return table.map((row) => {
    return row.flat();
  });
};
