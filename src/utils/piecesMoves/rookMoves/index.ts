import { TableType } from "../../../models/basicTypes";
import { getHorizontals } from "../general";

export const getRookProcessedMoves = (sqName: string, table: TableType) => {
  return getHorizontals(sqName, table);
};
