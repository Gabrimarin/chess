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
import { getKingProcessedMoves } from "../kingMoves";
import { getKnightProcessedMoves } from "../knightMoves";

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
  const piece = getPieceFromSquare(table, sqName)!;
  const pieceColor = getPieceColorFromSquare(table, sqName)!;
  const moves: Move[] = [];
  let nextSquare = directionGetter(sqName, pieceColor);
  while (nextSquare !== null) {
    const nextSquarePiece = getPieceFromSquare(table, nextSquare);
    if (nextSquarePiece) {
      const nextSquarePieceColor = getPieceColor(nextSquarePiece);
      if (nextSquarePieceColor !== pieceColor) {
        moves.push(getMove(sqName, nextSquare, piece, "eating"));
      }
      break;
    }
    moves.push(getMove(sqName, nextSquare, piece, "basic"));
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
  } else if (move.flag === "promotion") {
    const promotionPosition = getPositionFromSquareName(move.to);
    newTable[promotionPosition[1]][promotionPosition[0]] =
      getPieceColor(move.piece) === "white" ? "Q" : "q";
  } else if (move.flag === "castling") {
    const { rookInitial, rookGoesTo } = move.payload;
    const rookPosition = getPositionFromSquareName(rookInitial);
    const rook = getPieceFromSquare(table, rookInitial);
    newTable[rookPosition[1]][rookPosition[0]] = null;
    const kingPosition = getPositionFromSquareName(move.to);
    newTable[kingPosition[1]][kingPosition[0]] = piece;
    const rookGoesToPosition = getPositionFromSquareName(rookGoesTo);
    newTable[rookGoesToPosition[1]][rookGoesToPosition[0]] = rook;
  }
  return newTable;
};

const getMovesOfPiece = (
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
  if (["n", "N"].includes(piece)) {
    return getKnightProcessedMoves(sqName, table);
  }
  return [];
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

export function tableToFen(table: TableType) {
  let fen = "";

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const piece = table[i][j];
      if (piece === null) {
        let k = j + 1;
        while (k < 8 && table[i][k] === null) {
          k++;
        }
        fen += k - j;
        j = k - 1;
      } else {
        fen += piece;
      }
    }
    if (i !== 7) {
      fen += "/";
    }
  }
  return fen;
}

export const isSquareAttacked = (
  sqName: string,
  possibleMovesOfNotTurn: Move[]
) => {
  return possibleMovesOfNotTurn.some((move) => move.to === sqName);
};

export const getFilteredMoves = (
  table: TableType,
  moves: Move[],
  gameMoves: Move[]
) => {
  return moves.filter((m): boolean => {
    const pieceColor = getPieceColor(m.piece);
    const tableAfterMove = getTableAfterMove(table, m);
    const possibleMovesOfOpponent = getAllPossibleMoves(
      tableAfterMove,
      gameMoves.concat(m)
    ).filter((move) => getPieceColor(move.piece) !== pieceColor);
    const isCheck = possibleMovesOfOpponent.some(
      (move) => move.flag === "check"
    );
    return !isCheck;
  });
};

export const getAllPossibleMoves = (table: TableType, gameMoves: Move[]) => {
  const moves: Move[] = [];
  table.forEach((row, i) => {
    const rowWithSquares = row.map((piece, j) => {
      const squareName = getSquareName(j, i);
      return { piece, squareName };
    });
    for (const { piece, squareName } of rowWithSquares) {
      if (!piece) continue;
      const color = getPieceColor(piece);
      const opponentKingPosition = getKingPosition(
        table,
        color === "white" ? "black" : "white"
      );
      const pieceMoves = getMovesOfPiece(
        piece,
        squareName,
        table,
        gameMoves
      ).map((move) => ({
        ...move,
        flag: move.to === opponentKingPosition ? "check" : move.flag,
      }));

      moves.push(...pieceMoves);
    }
  });
  const colorList: PieceColor[] = ["white", "black"];

  colorList.forEach((color) => {
    const kingPosition = getKingPosition(table, color);
    const possibleMovesOfOpponent = moves.filter(
      (m) => getPieceColor(m.piece) !== color
    );

    const kingMoves = getKingProcessedMoves(
      kingPosition,
      table,
      possibleMovesOfOpponent,
      gameMoves
    );
    moves.push(...kingMoves);
  });

  return moves;
};

export const getKingPosition = (table: TableType, color: PieceColor) => {
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
  return "";
};
