import React, { useState } from "react";
import "./App.css";
import Table from "./components/Table";
import { Move, PieceColor, TableType } from "./models/basicTypes";
import { initialPositionFen } from "./utils/piecesMoves/constants";
import {
  fenToTable,
  getAllPossibleMoves,
  getKingPosition,
  getPieceColor,
  getPieceFromSquare,
  getTableAfterMove,
  isSquareAttacked,
} from "./utils/piecesMoves/general";

function App() {
  const initial_table = fenToTable(initialPositionFen);
  const [selected, setSelected] = useState<string | null>(null);
  const [table, setTable] = useState<TableType>(initial_table);
  const [moves, setMoves] = useState<Move[]>([]);
  const turn: PieceColor = moves.length % 2 === 0 ? "white" : "black";

  const allPossibleMoves = getAllPossibleMoves(table, moves);
  const possibleMovesOfTurnColor = allPossibleMoves.filter(
    (move) => getPieceColor(move.piece) === turn
  );
  const possibleMovesOfNotTurnColor = allPossibleMoves.filter(
    (move) => getPieceColor(move.piece) !== turn
  );
  const possibleMovesOfSelected = possibleMovesOfTurnColor.filter(
    (move) => move.from === selected
  );

  const turnKingPosition = getKingPosition(table, turn);
  const isCheck = isSquareAttacked(
    turnKingPosition,
    possibleMovesOfNotTurnColor
  );
  const isMate = isCheck && possibleMovesOfTurnColor.length === 0;

  const onClickSquare = (sqName: string) => {
    if (selected) {
      const move = possibleMovesOfSelected!.find(
        (m) => m.to === sqName && m.from === selected
      );
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
        possibleMoves={possibleMovesOfSelected}
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
