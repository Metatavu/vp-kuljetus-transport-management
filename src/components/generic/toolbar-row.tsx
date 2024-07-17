import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { IconButton, Stack, Theme, Typography, styled } from "@mui/material";
import { ReactNode, useCallback } from "react";

// Styled components
const Root = styled(Stack, {
  label: "toolbar--root",
})(({ theme, height }: { theme?: Theme; height?: number }) => ({
  justifyContent: "space-between",
  padding: theme?.spacing(1, 2),
  height: height ?? 42,
  flexDirection: "row",
}));

type Props = {
  height?: number;
  title?: string;
  toolbarButtons?: ReactNode;
  leftToolbar?: ReactNode;
  titleFirst?: boolean;
  navigateBack?: () => void;
};

const ToolbarRow = ({ height, title, toolbarButtons, leftToolbar, titleFirst, navigateBack }: Props) => {
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

  const renderLeftToolbar = useCallback(() => {
    if (!leftToolbar) return null;
    if (titleFirst) {
      return [renderTitle(), leftToolbar];
    }
    return [leftToolbar, renderTitle()];
  }, [leftToolbar, titleFirst, renderTitle]);

  return (
    <Root height={height}>
      <Stack direction="row" spacing={1} flex={1} alignItems="center">
        {renderBackButton()}
        {renderLeftToolbar()}
      </Stack>
      <Stack direction="row" spacing={1} alignItems="center">
        {toolbarButtons}
      </Stack>
    </Root>
  );
};

export default ToolbarRow;
