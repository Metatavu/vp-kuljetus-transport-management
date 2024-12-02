import { GridPaginationModel } from "@mui/x-data-grid";

namespace ServerSidePaginationUtils {
  export const paginationModelToRange = (paginationModel: GridPaginationModel) => {
    return {
      first: paginationModel.pageSize * paginationModel.page,
      max: paginationModel.pageSize * paginationModel.page + paginationModel.pageSize,
    };
  };
}

export default ServerSidePaginationUtils;
