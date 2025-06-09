import type { GridPaginationModel } from "@mui/x-data-grid";
import { useMemo } from "react";

namespace ServerSidePaginationUtils {
  export const paginationModelToRange = (paginationModel: GridPaginationModel) => {
    return {
      first: paginationModel.pageSize * paginationModel.page,
      max: paginationModel.pageSize * paginationModel.page + paginationModel.pageSize,
    };
  };
}

export const usePaginationToFirstAndMax = (pagination: GridPaginationModel): [first: number, max: number] => {
  const [first, max] = useMemo(() => {
    const first = pagination.page * pagination.pageSize;
    const max = pagination.pageSize;
    return [first, max];
  }, [pagination]);

  return [first, max];
};

export default ServerSidePaginationUtils;
