import {
  PieceColor,
  Move,
  TableType,
  getMove,
} from "../../../models/basicTypes";
import { letters } from "../constants";
import {
  getSquareInRightFront,
  getPieceColorFromSquare,
  getSquareInFront,
  getSquareInLeftFront,
  getPieceFromSquare,
  getPieceColor,
} from "../general";

const pawnPositions = {
  white: {
    firstLine: "2",
    enPassant: "5",
  },
  black: {
    firstLine: "7",
    enPassant: "4",
  },
};

const getPawnFrontMove = (
  sqName: string,
  pawnColor: PieceColor,
  table: TableType
): Move | null => {
  const frontSquare = getSquareInFront(sqName, pawnColor);
  if (!frontSquare) return null;
  const frontSquarePiece = getPieceFromSquare(table, frontSquare);
  if (frontSquarePiece) return null;

  return {
    from: sqName,
    to: frontSquare,
    flag: "basic",
  };
};

const getPawnEatingMoves = (
  sqName: string,
  pawnColor: PieceColor,
  table: TableType
) => {
  const moves: Move[] = [];
  const squareInRightFront = getSquareInRightFront(sqName, pawnColor);
  const pieceInRightFront =
    squareInRightFront && getPieceFromSquare(table, squareInRightFront);
  const pieceInRightFrontColor =
    pieceInRightFront && getPieceColor(pieceInRightFront);

  if (pieceInRightFrontColor && pieceInRightFrontColor !== pawnColor)
    moves.push(getMove(sqName, squareInRightFront, "eating"));

  const squareInLeftFront = getSquareInLeftFront(sqName, pawnColor);
  const pieceInLeftFront =
    squareInLeftFront && getPieceFromSquare(table, squareInLeftFront);
  const pieceInLeftFrontColor =
    pieceInLeftFront && getPieceColor(pieceInLeftFront);
  if (pieceInLeftFrontColor && pieceInLeftFrontColor !== pawnColor)
    moves.push(getMove(sqName, squareInLeftFront, "eating"));
  return moves;
};

const getPawnDoubleMove = (
  sqName: string,
  pawnColor: PieceColor,
  table: TableType
) => {
  const [, squareLine] = sqName.split("");
  const isInitialPosition = pawnPositions[pawnColor].firstLine === squareLine;
  if (!isInitialPosition) return null;
  const frontSquare = getSquareInFront(sqName, pawnColor)!;
  const squareInFront2 = getPawnFrontMove(frontSquare, pawnColor, table)!.to;
  if (!squareInFront2) return null;
  return getMove(sqName, squareInFront2);
};

const getEnPassantMove = (
  sqName: string,
  pawnColor: PieceColor,
  table: TableType,
  moves: Move[]
) => {
  const [, squareLine] = sqName.split("");
  const isFromEnPassantSquare =
    pawnPositions[pawnColor].enPassant === squareLine;
  if (!isFromEnPassantSquare) return null;
  const lastMove = moves[moves.length - 1];
  const isLastMoveFromPawn =
    getPieceFromSquare(table, lastMove.to)?.toUpperCase() === "P";
  if (!isLastMoveFromPawn) return null;
  const [lastMoveFrom, lastMoveTo] = [lastMove.from, lastMove.to];
  const isLastMoveTwoSquaresLong =
    Math.abs(parseInt(lastMoveFrom[1]) - parseInt(lastMoveTo[1])) === 2;
  if (!isLastMoveTwoSquaresLong) return null;
  const enPassantSquareColumn1 = letters[letters.indexOf(sqName[0]) - 1];
  const enPassantSquareColumn2 = letters[letters.indexOf(sqName[0]) + 1];
  const enPassantSquares = [
    enPassantSquareColumn1 + pawnPositions[pawnColor].enPassant,
    enPassantSquareColumn2 + pawnPositions[pawnColor].enPassant,
  ];
  const isLastMoveToEnPassantSquare = enPassantSquares.includes(lastMoveTo);
  if (isLastMoveToEnPassantSquare) {
    const enPassantSquare = `${lastMoveTo[0]}${
      parseInt(pawnPositions[pawnColor].enPassant) +
      (pawnColor === "white" ? 1 : -1)
    }`;
    return getMove(sqName, enPassantSquare, "enPassant");
  }
};

export const getPawnProcessedMoves = (
  sqName: string,
  table: TableType,
  moves: Move[]
) => {
  const pawnColor = getPieceColorFromSquare(table, sqName);
  if (!pawnColor) return [];
  const possibleMoves = [];
  // Front move
  possibleMoves.push(getPawnFrontMove(sqName, pawnColor, table));
  // Diagonal move
  possibleMoves.push(...getPawnEatingMoves(sqName, pawnColor, table));
  // Double move
  possibleMoves.push(getPawnDoubleMove(sqName, pawnColor, table));
  // En passant
  const enPassantMove = getEnPassantMove(sqName, pawnColor, table, moves);
  if (enPassantMove) {
    possibleMoves.push(enPassantMove);
  }

  possibleMoves.push(getEnPassantMove(sqName, pawnColor, table, moves));
  const filteredPossibleMoves = possibleMoves.filter(
    (move) => move !== null
  ) as Move[];
  return filteredPossibleMoves;
};
