import { useState } from "react";
import "./App.css";
import Table from "./components/Table";
import { Move, PieceColor, TableType } from "./models/basicTypes";
import { initialPositionFen } from "./utils/piecesMoves/constants";
import {
  evaluateCheck,
  evaluateCheckmate,
  fenToTable,
  getPieceColor,
  getPieceFromSquare,
  getPositionFromSquareName,
  getPossibleMoves,
  getTableAfterMove,
} from "./utils/piecesMoves/general";

function App() {
  const initial_table = fenToTable(initialPositionFen);
  const [selected, setSelected] = useState<string | null>(null);
  const [table, setTable] = useState<TableType>(initial_table);
  const [moves, setMoves] = useState<Move[]>([]);

  const turn: PieceColor = moves.length % 2 === 0 ? "white" : "black";
  const isCheck = evaluateCheck(table, turn);
  const isMate = evaluateCheckmate(table, turn);

  const possibleMoves = selected
    ? getPossibleMoves(table, selected, moves)
    : undefined;

  const onClickSquare = (sqName: string) => {
    if (selected) {
      const move = possibleMoves!.find(
        (m) => m.to === sqName && m.from === selected
      );
      if (move) {
        const newTable = getTableAfterMove(table, move);
        if (move.flag === "promotion") {
          const promotionPosition = getPositionFromSquareName(sqName);
          newTable[promotionPosition[1]][promotionPosition[0]] =
            turn === "white" ? "Q" : "q";
        }
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
        isCheck={isCheck}
        turn={turn}
      />
      <p>{moves.map((m) => m.from + m.to).join(", ")}</p>
      <p>turn: {turn}</p>
      <p>check: {isCheck.toString()}</p>
      <p>mate: {isMate.toString()}</p>
    </div>
  );
}

export default App;
