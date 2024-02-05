import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { IconButton, Stack, Typography } from "@mui/material";
import { ReactNode } from "react";

type Props = {
  title: string;
  toolbarButtons?: ReactNode;
  backButtonVisible?: boolean;
};

const ToolbarRow = ({ title, toolbarButtons, backButtonVisible }: Props) => {
  const renderBackButton = () => {
    if (!backButtonVisible) return null;

    return (
      <IconButton sx={{ padding: "5px" }} onClick={() => history.back()}>
        <ArrowBackIcon />
      </IconButton>
    );
  };
  return (
    <Stack direction="row" justifyContent="space-between" padding="8px 16px">
      <Stack direction="row" spacing={1}>
        {renderBackButton()}
        <Typography variant="h6" sx={{ opacity: 0.87 }} alignSelf="center">
          {title}
        </Typography>
      </Stack>
      <Stack direction="row" spacing={1}>
        {toolbarButtons}
      </Stack>
    </Stack>
  );
};

export default ToolbarRow;
