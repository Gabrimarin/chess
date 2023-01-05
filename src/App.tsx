import { useState } from "react";
import "./App.css";
import Table from "./components/Table";
import { Move, PieceColor, TableType } from "./models/basicTypes";
import { initialPositionFen } from "./utils/piecesMoves/constants";
import {
  fenToTable,
  getPieceColor,
  getPieceFromSquare,
  getPossibleMoves,
  getTableAfterMove,
} from "./utils/piecesMoves/general";

function App() {
  const initial_table = fenToTable(initialPositionFen);
  const [selected, setSelected] = useState<string | null>(null);
  const [table, setTable] = useState<TableType>(initial_table);
  const [moves, setMoves] = useState<Move[]>([]);
  const turn: PieceColor = moves.length % 2 === 0 ? "white" : "black";

  const possibleMoves = selected
    ? getPossibleMoves(table, selected, moves)
    : undefined;

  const onClickSquare = (sqName: string) => {
    if (selected) {
      const move = possibleMoves!.find((m) => m.to === sqName);
      if (move) {
        const newTable = getTableAfterMove(table, move);
        setMoves([...moves, move]);
        setTable(newTable);
        setSelected(null);
      } else {
        setSelected(null);
      }
    } else {
      const pieceOfSquare = getPieceFromSquare(table, sqName);
      if (pieceOfSquare && getPieceColor(pieceOfSquare) === turn) {
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
      <p>{moves.join(", ")}</p>
      <p>{turn}</p>
    </div>
  );
}

export default App;
