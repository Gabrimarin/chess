import React from "react";
import { Move, PieceColor } from "../../models/basicTypes";
import { getPieceColor } from "../../utils/piecesMoves/general";
import TableSquare from "../TableSquare";
const letters = ["a", "b", "c", "d", "e", "f", "g", "h"];
function Table({
  table,
  onClickSquare,
  selected,
  possibleMoves,
  turn,
  isCheck,
  rotatePiecesOfColor = null,
  rotateBoard = false,
}: {
  table: (string | null)[][];
  onClickSquare: (name: string) => void;
  selected: string | null;
  possibleMoves: Move[] | undefined;
  turn: PieceColor;
  isCheck: boolean;
  rotatePiecesOfColor?: PieceColor | null | "both";
  rotateBoard?: boolean;
}) {
  return (
    <div
      style={{
        border: "1px solid black",
        width: "100%",
        borderRadius: 10,
        boxShadow: "1px 2px 14px 1px rgba(0, 0, 0, 0.5)",
        overflow: "hidden",
        aspectRatio: "1/1",
        transform: rotateBoard ? "rotate(180deg)" : "none",
      }}
    >
      {table.map((row, i) => {
        return (
          <div
            key={i}
            style={{
              display: "flex",
              width: "100%",
              height: "calc(100% / 8)",
            }}
          >
            {row.map((cell, j) => {
              const squareName = letters[j] + (8 - i);
              const state =
                selected === squareName
                  ? "selected"
                  : possibleMoves?.find((move) => move.to === squareName)
                  ? "possible"
                  : "default";
              const isTurnKing =
                cell !== null &&
                getPieceColor(cell) === turn &&
                cell?.toUpperCase() === "K";
              const isCheckSquare = isCheck && isTurnKing;
              return (
                <TableSquare
                  rotate={Boolean(
                    cell &&
                      (getPieceColor(cell) === rotatePiecesOfColor ||
                        rotatePiecesOfColor === "both")
                  )}
                  state={state}
                  piece={cell}
                  onClick={() => onClickSquare(squareName)}
                  name={squareName}
                  key={j}
                  color={(i + j) % 2 === 0 ? "white" : "black"}
                  isCheck={isCheckSquare}
                />
              );
            })}
            <br />
          </div>
        );
      })}
    </div>
  );
}

export default Table;
