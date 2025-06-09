import { Skeleton } from "@mui/material";

type Props<T> = {
  value: T;
  loading: boolean;
};

const LoadingCellValue = <T,>({ value, loading }: Props<T>) => {
  if (loading) {
    return <Skeleton width="100%" />;
  }
  return value;
};

export default LoadingCellValue;
