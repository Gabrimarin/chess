import { useState } from "react";
import "./App.css";
import Table from "./components/Table";

const getSquareName = (letterIndex: number, numberIndex: number) => {
  const letter = "abcdefgh"[letterIndex];
  const number = 8 - numberIndex;
  return letter + number;
};

const getPositionFromSquareName = (sqName: string) => {
  const [letter, number] = sqName.split("");
  const letterIndex = "abcdefgh".indexOf(letter);
  const numberIndex = 8 - parseInt(number);
  return [letterIndex, numberIndex];
};

const getPieceFromSquare = (
  table: (string | null)[][],
  sqName: string
): string | null => {
  const [letterIndex, numberIndex] = getPositionFromSquareName(sqName);
  return table[numberIndex][letterIndex];
};

const getTableAfterMove = (
  table: (string | null)[][],
  from: string,
  to: string
) => {
  const piece = getPieceFromSquare(table, from);
  const piecePosition = getPositionFromSquareName(from);
  const position = getPositionFromSquareName(to);
  const newTable = table.map((row) => row.map((cell) => cell));
  newTable[piecePosition[1]][piecePosition[0]] = null;
  newTable[position[1]][position[0]] = piece;
  return newTable;
};

const getPossibleMoves = (table: (string | null)[][], sqName: string) => {
  const moves: string[] = [];
  table.forEach((row, i) => {
    row.forEach((cell, j) => {
      const squareName = getSquareName(j, i);
      if (squareName !== sqName) {
        moves.push(squareName);
      } else {
        console.log("same square");
        console.log(j, i, sqName, squareName);
      }
    });
  });
  return moves;
};

function App() {
  const initial_table = [
    ["p", "P", "P", "p", "p", "p", "p", "P"],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
  ];
  const [selected, setSelected] = useState<string | null>(null);
  const [table, setTable] = useState<(string | null)[][]>(initial_table);
  const possibleMoves = selected
    ? getPossibleMoves(table, selected)
    : undefined;

  const onClickSquare = (sqName: string) => {
    if (selected) {
      if (selected !== sqName) {
        const newTable = getTableAfterMove(table, selected, sqName);
        setTable(newTable);
        setSelected(null);
      } else {
        setSelected(null);
      }
    } else {
      const pieceOfSquare = getPieceFromSquare(table, sqName);
      if (pieceOfSquare) {
        setSelected(sqName);
      }
    }
  };

  return (
    <div>
      <Table
        table={table}
        selected={selected}
        onClickSquare={onClickSquare}
        possibleMoves={possibleMoves}
      />
    </div>
  );
}

export default App;
