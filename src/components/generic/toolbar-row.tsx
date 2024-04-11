import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { IconButton, Stack, Typography, styled } from "@mui/material";
import { ReactNode } from "react";

// Styled components
const Root = styled(Stack, {
  label: "toolbar--root",
})(({ theme }) => ({
  justifyContent: "space-between",
  padding: theme.spacing(1, 2),
  height: 42,
  flexDirection: "row"
}));

type Props = {
  title?: string;
  toolbarButtons?: ReactNode;
  leftToolbar?: ReactNode;
  navigateBack?: () => void;
};

const ToolbarRow = ({ title, toolbarButtons, leftToolbar, navigateBack }: Props) => {
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

  const renderLeftToolbar = () => {
    if (!leftToolbar) return null;

    return leftToolbar;
  };

  return (
    <Root>
      <Stack direction="row" spacing={1} flex={1}>
        {renderBackButton()}
        {renderLeftToolbar()}
        {renderTitle()}
      </Stack>
      <Stack direction="row" spacing={1}>
        {toolbarButtons}
      </Stack>
    </Root>
  );
};

export default ToolbarRow;
