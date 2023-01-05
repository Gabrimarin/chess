import { getMove, Move, TableType } from "../../../models/basicTypes";
import {
  getPieceColor,
  getPieceColorFromSquare,
  getPieceFromSquare,
  getSquareInLeftBack,
  getSquareInLeftFront,
  getSquareInRightBack,
  getSquareInRightFront,
} from "../general";

const getDiagonals = (sqName: string, table: TableType) => {
  const diagonals: Move[] = [];
  [
    getSquareInRightFront,
    getSquareInLeftFront,
    getSquareInRightBack,
    getSquareInLeftBack,
  ].forEach((getSquare) => {
    const pieceColor = getPieceColorFromSquare(table, sqName)!;
    let square = sqName;
    do {
      const diagonal = getSquare(square, pieceColor);
      if (!diagonal) break;
      const squarePiece = getPieceFromSquare(table, diagonal);
      if (squarePiece) {
        const squarePieceColor = getPieceColor(squarePiece);
        if (squarePieceColor !== pieceColor) {
          diagonals.push(getMove(sqName, diagonal, "eating"));
        }
        break;
      }
      diagonals.push(getMove(sqName, diagonal, "basic"));
      square = diagonal;
    } while (true);
  });
  return diagonals;
};

export const getBishopProcessedMoves = (
  sqName: string,
  table: TableType,
  moves: Move[]
) => {
  return getDiagonals(sqName, table);
};
