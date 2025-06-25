import { Backdrop, CircularProgress } from "@mui/material";
import type { ReactNode } from "react";

type Props = {
  loading: boolean;
  children: ReactNode;
};

const LoaderWrapper = ({ loading, children }: Props) => {
  if (loading)
    return (
      <>
        <Backdrop sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
          <CircularProgress color="primary" />
        </Backdrop>
        {children}
      </>
    );

  return <>{children}</>;
};

export default LoaderWrapper;
