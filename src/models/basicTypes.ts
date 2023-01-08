export type PieceColor = "white" | "black";
export type MoveFlag =
  | "basic"
  | "eating"
  | "enPassant"
  | "castling"
  | "promotion";
export type Move = {
  from: string;
  to: string;
  piece: string;
  flag?: MoveFlag;
  payload?: any;
};
export type TableType = (string | null)[][];
export const getMove = (
  from: string,
  to: string,
  piece: string,
  flag: MoveFlag = "basic",
  payload: any = null
): Move => {
  return { from, to, flag, piece, payload };
};
