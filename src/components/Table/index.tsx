import React from "react";
import { Move } from "../../models/basicTypes";
import TableSquare from "../TableSquare";
const letters = ["a", "b", "c", "d", "e", "f", "g", "h"];
function Table({
  table,
  onClickSquare,
  selected,
  possibleMoves,
}: {
  table: (string | null)[][];
  onClickSquare: (name: string) => void;
  selected: string | null;
  possibleMoves: Move[] | undefined;
}) {
  return (
    <div
      style={{
        border: "1px solid black",
        width: "fit-content",
        borderRadius: 10,
        boxShadow: "1px 2px 14px 1px rgba(0, 0, 0, 0.5)",
        margin: "auto",
        overflow: "hidden",
        marginTop: 200,
      }}
    >
      {table.map((row, i) => {
        return (
          <div
            key={i}
            style={{
              display: "flex",
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

              return (
                <TableSquare
                  state={state}
                  piece={cell}
                  onClick={() => onClickSquare(squareName)}
                  name={squareName}
                  key={j}
                  color={(i + j) % 2 === 0 ? "white" : "black"}
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
