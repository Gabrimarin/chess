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
    promotion: "8",
  },
  black: {
    firstLine: "7",
    enPassant: "4",
    promotion: "1",
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
  return getMove(
    sqName,
    frontSquare,
    pawnColor === "white" ? "P" : "p",
    "basic"
  );
};

const getPawnEatingMoves = (
  sqName: string,
  pawnColor: PieceColor,
  table: TableType
) => {
  const piece = pawnColor === "white" ? "P" : "p";
  const moves: Move[] = [];
  const squareInRightFront = getSquareInRightFront(sqName, pawnColor);
  const pieceInRightFront =
    squareInRightFront && getPieceFromSquare(table, squareInRightFront);
  const pieceInRightFrontColor =
    pieceInRightFront && getPieceColor(pieceInRightFront);

  if (pieceInRightFrontColor && pieceInRightFrontColor !== pawnColor)
    moves.push(getMove(sqName, squareInRightFront, piece, "eating"));

  const squareInLeftFront = getSquareInLeftFront(sqName, pawnColor);
  const pieceInLeftFront =
    squareInLeftFront && getPieceFromSquare(table, squareInLeftFront);
  const pieceInLeftFrontColor =
    pieceInLeftFront && getPieceColor(pieceInLeftFront);
  if (pieceInLeftFrontColor && pieceInLeftFrontColor !== pawnColor)
    moves.push(getMove(sqName, squareInLeftFront, piece, "eating"));
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
  const frontSquarePiece = getPieceFromSquare(table, frontSquare);
  if (frontSquarePiece) return null;
  const squareInFront2 = getSquareInFront(frontSquare, pawnColor);
  const squareInFront2Piece = getPieceFromSquare(table, squareInFront2!);
  if (squareInFront2Piece) return null;
  return getMove(sqName, squareInFront2!, pawnColor === "white" ? "P" : "p");
};

const getEnPassantMove = (
  sqName: string,
  pawnColor: PieceColor,
  table: TableType,
  moves: Move[]
) => {
  const piece = pawnColor === "white" ? "P" : "p";
  if (moves.length === 0) return null;
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
  if (!isLastMoveToEnPassantSquare) return null;
  const enPassantSquare = `${lastMoveTo[0]}${
    parseInt(pawnPositions[pawnColor].enPassant) +
    (pawnColor === "white" ? 1 : -1)
  }`;
  return getMove(sqName, enPassantSquare, piece, "enPassant");
};

export const getPawnProcessedMoves = (
  sqName: string,
  table: TableType,
  moves: Move[]
) => {
  const pawnColor = getPieceColorFromSquare(table, sqName);
  if (!pawnColor) return [];
  const possibleMoves: (Move | null)[] = [];
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

  return filteredPossibleMoves.map((move) => {
    const [, squareLine] = move.to.split("");
    const isPromotion = squareLine === pawnPositions[pawnColor].promotion;
    return {
      ...move,
      flag: isPromotion ? "promotion" : move.flag,
    };
  });
};
