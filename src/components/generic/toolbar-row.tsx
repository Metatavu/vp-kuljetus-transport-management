import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { IconButton, Stack, type Theme, Typography, styled } from "@mui/material";
import { type ReactNode, useCallback } from "react";

// Styled components
const Root = styled(Stack, {
  label: "toolbar--root",
})(({ theme, height }: { theme?: Theme; height?: number }) => ({
  justifyContent: "space-between",
  padding: theme?.spacing(1, 2),
  height: height ?? 46,
  flexDirection: "row",
  borderBottom: `1px solid ${theme?.palette.divider}`,
}));

type Props = {
  height?: number;
  title?: string;
  toolbarButtons?: ReactNode;
  leftToolbar?: ReactNode;
  navigateBack?: () => void;
};

const ToolbarRow = ({ height, title, toolbarButtons, leftToolbar, navigateBack }: Props) => {
  const renderBackButton = useCallback(() => {
    if (!navigateBack) return null;

    return (
      <IconButton key="back-button" sx={{ p: 1 }} onClick={navigateBack}>
        <ArrowBackIcon />
      </IconButton>
    );
  }, [navigateBack]);

  const renderTitle = useCallback(() => {
    if (!title) return null;

    return (
      <Typography key="title" variant="subtitle1" alignSelf="center">
        {title}
      </Typography>
    );
  }, [title]);

  return (
    <Root height={height}>
      <Stack direction="row" spacing={2} flex={1} alignItems="center">
        {renderBackButton()}
        {renderTitle()}
        {leftToolbar}
      </Stack>
      {toolbarButtons}
    </Root>
  );
};

export default ToolbarRow;
