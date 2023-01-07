import {
  getMove,
  Move,
  PieceColor,
  TableType,
} from "../../../models/basicTypes";
import { letters } from "../constants";
import { getPawnProcessedMoves } from "../pawnMoves";
import { getBishopProcessedMoves } from "../bishopMoves";
import { getRookProcessedMoves } from "../rookMoves";
import { getQueenProcessedMoves } from "../queenMoves";
// import { getKingProcessedMoves } from "../kingMoves";

export const getPieceColor = (piece: string): PieceColor => {
  return piece === piece.toUpperCase() ? "white" : "black";
};

export const getPositionFromSquareName = (sqName: string) => {
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

const getMovesInDirection = (
  sqName: string,
  directionGetter: Function,
  table: TableType
) => {
  const pieceColor = getPieceColorFromSquare(table, sqName)!;
  const moves: Move[] = [];
  let nextSquare = directionGetter(sqName, pieceColor);
  while (nextSquare !== null) {
    const nextSquarePiece = getPieceFromSquare(table, nextSquare);
    if (nextSquarePiece) {
      const nextSquarePieceColor = getPieceColor(nextSquarePiece);
      if (nextSquarePieceColor !== pieceColor) {
        moves.push(getMove(sqName, nextSquare, "eating"));
      }
      break;
    }
    moves.push(getMove(sqName, nextSquare, "basic"));
    nextSquare = directionGetter(nextSquare, pieceColor);
  }
  return moves;
};

const getMovesInDirections = (
  sqName: string,
  directions: Function[],
  table: TableType
) => {
  const moves: Move[] = [];
  directions.forEach((directionGetter) => {
    moves.push(...getMovesInDirection(sqName, directionGetter, table));
  });
  return moves;
};

export const getDiagonals = (sqName: string, table: TableType) => {
  return getMovesInDirections(
    sqName,
    [
      getSquareInRightFront,
      getSquareInLeftFront,
      getSquareInRightBack,
      getSquareInLeftBack,
    ],
    table
  );
};

export const getHorizontals = (sqName: string, table: TableType) => {
  return getMovesInDirections(
    sqName,
    [getSquareInRight, getSquareInLeft, getSquareInFront, getSquareInBack],
    table
  );
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

const getMoviesOfPiece = (
  piece: string,
  sqName: string,
  table: TableType,
  moves: Move[]
) => {
  if (["p", "P"].includes(piece)) {
    return getPawnProcessedMoves(sqName, table, moves);
  }
  if (["b", "B"].includes(piece)) {
    return getBishopProcessedMoves(sqName, table);
  }
  if (["r", "R"].includes(piece)) {
    return getRookProcessedMoves(sqName, table);
  }
  if (["q", "Q"].includes(piece)) {
    return getQueenProcessedMoves(sqName, table);
  }
  // if (["k", "K"].includes(piece)) {
  //   return getKingProcessedMoves(sqName, table);
  // }
  return [];
};

const removeInvalidMoves = (
  moves: Move[],
  table: TableType,
  color: PieceColor
) => {
  const newMoves: Move[] = [];
  moves.forEach((move) => {
    const newTable = getTableAfterMove(table, move);
    if (!evaluateCheck(newTable, color)) {
      newMoves.push(move);
    }
  });
  return newMoves;
};

export const getPossibleMoves = (
  table: TableType,
  sqName: string,
  moves: Move[],
  passCheckValidation = false
): Move[] => {
  const possibleMoves: Move[] = [];

  const piece = getPieceFromSquare(table, sqName);
  if (!piece) {
    return possibleMoves;
  }
  const pieceColor = getPieceColor(piece);
  const pieceMoves = getMoviesOfPiece(piece, sqName, table, moves);
  if (passCheckValidation) {
    return pieceMoves;
  }
  const validMoves = removeInvalidMoves(pieceMoves, table, pieceColor);
  return validMoves;
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

const getAllPossibleMoves = (
  table: TableType,
  color: PieceColor,
  passCheckValidation = false
) => {
  const moves: Move[] = [];
  table.forEach((row, i) => {
    row.forEach((piece, j) => {
      if (piece && getPieceColor(piece) === color) {
        const squareName = getSquareName(j, i);
        moves.push(
          ...getPossibleMoves(table, squareName, moves, passCheckValidation)
        );
      }
    });
  });
  return moves;
};

const getKingPosition = (table: TableType, color: PieceColor) => {
  for (let i = 0; i < table.length; i++) {
    for (let j = 0; j < table[i].length; j++) {
      const piece = table[i][j];
      if (
        piece &&
        getPieceColor(piece) === color &&
        piece.toLowerCase() === "k"
      ) {
        return getSquareName(j, i);
      }
    }
  }
};

// Returns true if king of selected color is in check
export const evaluateCheck = (table: TableType, color: PieceColor) => {
  const moves = getAllPossibleMoves(
    table,
    color === "white" ? "black" : "white",
    true
  );
  const kingPosition = getKingPosition(table, color);
  return moves.some((move) => move.to === kingPosition);
};

// Returns true if king of selected color is in checkmate
export const evaluateCheckmate = (table: TableType, color: PieceColor) => {
  const isCheck = evaluateCheck(table, color);
  if (!isCheck) return false;
  const moves = getAllPossibleMoves(table, color);
  return moves.length === 0;
};

export const evaluateStalemate = (table: TableType, color: PieceColor) => {
  const isCheck = evaluateCheck(table, color);
  if (isCheck) return false;
  const moves = getAllPossibleMoves(table, color);
  return moves.length === 0;
};
