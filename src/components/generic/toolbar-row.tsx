import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { IconButton, Stack, Typography } from "@mui/material";
import { ReactNode } from "react";

type Props = {
  title?: string;
  toolbarButtons?: ReactNode;
  navigateBack?: () => void;
};

const ToolbarRow = ({ title, toolbarButtons, navigateBack }: Props) => {
  const renderBackButton = () => {
    if (!navigateBack) return null;

    return (
      <IconButton sx={{ padding: "5px" }} onClick={navigateBack}>
        <ArrowBackIcon />
      </IconButton>
    );
  };

  const renderTitle = () => {
    if (!title) return null;

    return (
      <Typography variant="h6" sx={{ opacity: 0.87 }} alignSelf="center">
        {title}
      </Typography>
      );
  };
  return (
    <Stack direction="row" justifyContent="space-between" padding="8px 16px">
      <Stack direction="row" spacing={1}>
        {renderBackButton()}
        {renderTitle()}
      </Stack>
      <Stack direction="row" spacing={1}>
        {toolbarButtons}
      </Stack>
    </Stack>
  );
};

export default ToolbarRow;
