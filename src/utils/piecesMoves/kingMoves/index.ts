import { getMove, Move, TableType } from "../../../models/basicTypes";
import {
  getPieceColor,
  getPieceColorFromSquare,
  getPieceFromSquare,
  getSquareInBack,
  getSquareInFront,
  getSquareInLeft,
  getSquareInLeftBack,
  getSquareInLeftFront,
  getSquareInRight,
  getSquareInRightBack,
  getSquareInRightFront,
  isSquareAttacked,
} from "../general";

export const kingPositions: any = {
  white: {
    initial: "e1",
    kingSideCastling: {
      kingGoesTo: "g1",
      rookInitial: "h1",
      rookGoesTo: "f1",
      squaresInBetween: ["f1", "g1"],
    },
    queenSideCastling: {
      kingGoesTo: "c1",
      rookInitial: "a1",
      rookGoesTo: "d1",
      squaresInBetween: ["b1", "c1", "d1"],
    },
  },
  black: {
    initial: "e8",
    kingSideCastling: {
      kingGoesTo: "g8",
      rookInitial: "h8",
      rookGoesTo: "f8",
      squaresInBetween: ["f8", "g8"],
    },
    queenSideCastling: {
      kingGoesTo: "c8",
      rookInitial: "a8",
      rookGoesTo: "d8",
      squaresInBetween: ["b8", "c8", "d8"],
    },
  },
};

export const getCastlingMoves = (
  sqName: string,
  table: TableType,
  gameMoves: Move[],
  possibleMovesOfOpponent: Move[] = []
) => {
  const kingColor = getPieceColorFromSquare(table, sqName)!;
  const isCheck = isSquareAttacked(sqName, possibleMovesOfOpponent);
  const castlingMoves: Move[] = [];
  const initialPosition = kingPositions[kingColor].initial;
  if (sqName !== initialPosition) return castlingMoves;
  if (isCheck) return castlingMoves;
  if (
    gameMoves.some((move) => move.piece === (kingColor === "white" ? "K" : "k"))
  )
    return castlingMoves;
  // King side castling
  for (const castling of [`kingSideCastling`, `queenSideCastling`]) {
    const castlingData = kingPositions[kingColor][castling];
    const { kingGoesTo, rookGoesTo, squaresInBetween, rookInitial } =
      castlingData;
    const rookWasMoved = gameMoves.some((move) => move.from === rookInitial);
    if (rookWasMoved) continue;
    const kingGoesToPiece = getPieceFromSquare(table, kingGoesTo);
    if (kingGoesToPiece) continue;
    const rookGoesToPiece = getPieceFromSquare(table, rookGoesTo);
    if (rookGoesToPiece) continue;
    const squaresInBetweenPieces = squaresInBetween.map((sq: string) =>
      getPieceFromSquare(table, sq)
    );
    if (squaresInBetweenPieces.some((piece: string | null) => piece)) continue;
    const isCheckInKingGoesTo = isSquareAttacked(
      sqName,
      possibleMovesOfOpponent
    );
    if (isCheckInKingGoesTo) continue;
    const isCheckInRookGoesTo = isSquareAttacked(
      sqName,
      possibleMovesOfOpponent
    );
    if (isCheckInRookGoesTo) continue;
    const isCheckInSquaresInBetween = squaresInBetween.some((sq: string) =>
      isSquareAttacked(sq, possibleMovesOfOpponent)
    );
    if (isCheckInSquaresInBetween) continue;
    castlingMoves.push(
      getMove(
        sqName,
        kingGoesTo,
        kingColor === "white" ? "K" : "k",
        "castling",
        {
          castlingSide: castling,
          rookInitial,
          rookGoesTo,
          kingGoesTo,
        }
      )
    );
  }
  return castlingMoves;
};

export const getKingProcessedMoves = (
  sqName: string,
  table: TableType,
  possibleMovesOfOpponent: Move[],
  gameMoves: Move[]
) => {
  const kingMoves: Move[] = [];
  const kingColor = getPieceColorFromSquare(table, sqName)!;
  for (const squareGetter of [
    getSquareInFront,
    getSquareInLeftFront,
    getSquareInLeft,
    getSquareInLeftBack,
    getSquareInBack,
    getSquareInRightBack,
    getSquareInRight,
    getSquareInRightFront,
  ]) {
    const piece = getPieceFromSquare(table, sqName)!;
    const pieceColor = getPieceColor(piece);
    const nextSquare = squareGetter(sqName, kingColor);
    if (!nextSquare) continue;
    const nextSquarePiece = getPieceFromSquare(table, nextSquare);
    if (nextSquarePiece) {
      const nextSquarePieceColor = getPieceColor(nextSquarePiece);
      if (nextSquarePieceColor !== pieceColor) {
        kingMoves.push(getMove(sqName, nextSquare, piece, "eating"));
      }
    } else {
      kingMoves.push(getMove(sqName, nextSquare, piece, "basic"));
    }
  }
  const castlingMoves = getCastlingMoves(
    sqName,
    table,
    gameMoves,
    possibleMovesOfOpponent
  );
  kingMoves.push(...castlingMoves);
  return kingMoves;
};
