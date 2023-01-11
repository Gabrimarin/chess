import { useState } from "react";
import { Move, PieceColor, TableType } from "../models/basicTypes";
import { initialPositionFen } from "../utils/piecesMoves/constants";
import {
  fenToTable,
  getAllPossibleMoves,
  getFilteredMoves,
  getKingPosition,
  getPieceColor,
  getPieceFromSquare,
  getTableAfterMove,
} from "../utils/piecesMoves/general";

const useGameData = ({
  onMove,
  playerColor,
}: {
  onMove: Function;
  playerColor: PieceColor;
}) => {
  const initial_table = fenToTable(initialPositionFen);
  const [selected, setSelected] = useState<string | null>(null);
  const [table, setTable] = useState<TableType>(initial_table);
  const [moves, setMoves] = useState<Move[]>([]);
  const turn: PieceColor = moves.length % 2 === 0 ? "white" : "black";
  const allPossibleMoves = getAllPossibleMoves(table, moves);
  const possibleMovesOfTurnColor = getFilteredMoves(
    table,
    allPossibleMoves.filter((move) => getPieceColor(move.piece) === turn),
    moves
  );

  const possibleMovesOfNotTurnColor = allPossibleMoves.filter(
    (move) => getPieceColor(move.piece) !== turn
  );
  const possibleMovesOfSelected = possibleMovesOfTurnColor.filter(
    (move) => move.from === selected
  );

  const turnKingPosition = getKingPosition(table, turn);
  const isCheck = possibleMovesOfNotTurnColor.some(
    (move) => move.flag === "check"
  );

  const isMate = isCheck && possibleMovesOfTurnColor.length === 0;

  const onClickSquare = (sqName: string) => {
    if (playerColor !== turn) return;
    if (selected) {
      const move = possibleMovesOfSelected!.find(
        (m) => m.to === sqName && m.from === selected
      );
      if (move) {
        const newTable = getTableAfterMove(table, move);

        setMoves([...moves, move]);
        setTable(newTable);
        onMove(newTable, [...moves, move]);
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

  const updateLocalData = (table: TableType, moves: Move[]) => {
    setTable(table);
    setMoves(moves);
  };

  return {
    onClickSquare,
    turnKingPosition,
    isCheck,
    isMate,
    turn,
    table,
    updateLocalData,
    selectedSquare: selected,
    possibleMovesOfSelected,
  };
};

export default useGameData;
