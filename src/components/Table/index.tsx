import React from "react";
import TableSquare from "../TableSquare";

function Table({ table }: { table: (string | null)[][] }) {
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
              return (
                <TableSquare
                  piece={cell}
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
