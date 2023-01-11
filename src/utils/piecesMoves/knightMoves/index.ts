import { Move, TableType } from "../../../models/basicTypes";
import { letters } from "../constants";
import { getPieceColorFromSquare } from "../general";

export const getKnightProcessedMoves = (sqName: string, table: TableType) => {
  const pieceColor = getPieceColorFromSquare(table, sqName);
  const [column, row] = sqName.split("");
  const rowNumber = parseInt(row);
  const columnIndex = letters.indexOf(column);
  const lines = [rowNumber + 2, rowNumber + 1, rowNumber - 1, rowNumber - 2];
  const columnPair = [
    [columnIndex + 1, columnIndex - 1],
    [columnIndex + 2, columnIndex - 2],
    [columnIndex + 2, columnIndex - 2],
    [columnIndex + 1, columnIndex - 1],
  ];

  const moves: Move[] = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line < 1 || line > 8) continue;
    for (let j = 0; j < columnPair[i].length; j++) {
      const col = columnPair[i][j];
      if (col < 0 || col > 7) continue;
      const square = letters[col] + line;
      if (getPieceColorFromSquare(table, square) === pieceColor) continue;
      moves.push({
        from: sqName,
        to: letters[col] + line,
        piece: pieceColor === "white" ? "N" : "n",
        flag: "basic",
      });
    }
  }
  return moves;
};
