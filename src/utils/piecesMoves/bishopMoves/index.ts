import { TableType } from "../../../models/basicTypes";
import { getDiagonals } from "../general";

export const getBishopProcessedMoves = (sqName: string, table: TableType) => {
  return getDiagonals(sqName, table);
};
