import { Box, FormControlLabel, Switch, colors } from "@mui/material";
import { useState } from "react";
import Table from "../../components/Table";
import { Move, PieceColor, TableType } from "../../models/basicTypes";
import { initialPositionFen } from "../../utils/piecesMoves/constants";
import {
  fenToTable,
  getAllPossibleMoves,
  getFilteredMoves,
  getKingPosition,
  getPieceColor,
  getPieceFromSquare,
  getTableAfterMove,
} from "../../utils/piecesMoves/general";

const getAlgebraicNotationOfHalfMove = (move: Move) => {
  const { from, to, flag, piece, payload } = move;
  let notation = "";
  if (piece.toUpperCase() === "P") {
    if (flag === "basic") {
      notation += from;
    } else if (flag === "check") {
      notation += from[0];
    } else if (flag === "eating") {
      notation += from[0];
    }
  } else {
    notation += piece.toUpperCase();
  }
  notation += to;
  if (flag === "check") {
    notation += "+";
  }
  if (flag === "eating") {
    notation += "x";
  }
  if (flag === "castling") {
    notation = payload.castlingSide === "kingSideCastling" ? "O-O" : "O-O-O";
  }

  return notation;
};

const getAlgebraicNotation = (moves: Move[]) => {
  let notation = "";
  moves.forEach((move, i) => {
    if (i % 2 === 0) {
      notation += `${Math.floor(i / 2) + 1}. `;
    }
    notation += getAlgebraicNotationOfHalfMove(move);
    if (i % 2 === 1) {
      notation += " ";
    }
  });
  return notation;
};

function LocalMatch() {
  const [isFlipped, setIsFlipped] = useState(false);
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
    <Box
      width={1}
      height={1}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      bgcolor={colors.blueGrey[100]}
    >
      <Box
        my={2}
        width={
          window.innerWidth > window.innerHeight
            ? window.innerHeight * 0.6
            : window.innerWidth * 0.6
        }
      >
        <Table
          table={table}
          selected={selected}
          onClickSquare={onClickSquare}
          possibleMoves={possibleMovesOfSelected}
          isCheck={isCheck}
          turn={turn}
          rotateBoard={isFlipped && turn === "black"}
          rotatePiecesOfColor={isFlipped ? "both" : "black"}
        />
      </Box>
      <FormControlLabel
        control={<Switch />}
        label="Flip board on black turn"
        value={isFlipped}
        onChange={(e) => setIsFlipped((prev) => !prev)}
      />
      {/* <p>{moves.map((m) => m.from + m.to).join(", ")}</p>
      <p>turn: {turn}</p>
      <p>check: {isCheck.toString()}</p>
      <p>mate: {isMate.toString()}</p>
      <p>king position: {turnKingPosition}</p>
      <p>algebraic notation: {getAlgebraicNotation(moves)}</p> */}
    </Box>
  );
}
export default LocalMatch;
