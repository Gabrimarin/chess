import { TableType } from "../../../models/basicTypes";
import { getDiagonals, getHorizontals } from "../general";

export const getQueenProcessedMoves = (sqName: string, table: TableType) => {
  return getHorizontals(sqName, table).concat(getDiagonals(sqName, table));
};
