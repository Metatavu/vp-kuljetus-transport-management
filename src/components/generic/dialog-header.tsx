import { Close } from "@mui/icons-material";
import { IconButton, Stack, Typography, styled } from "@mui/material";
import { ElementType } from "react";
import { theme } from "../../theme"

const StyledDialogHeader = styled(Stack, {
  label: "styled-dialog-header",
})(({ theme }) => ({
  position: "sticky",
  top: 0,
  zIndex: 1,
  flexDirection: "row",
  backgroundColor: theme.palette.primary.light,
  justifyContent: "space-between",
}));

const StyledDialogHeaderContent = styled(Stack, {
  label: "styled-dialog-header-content",
})(({ theme }) => ({
  flexDirection: "row",
  alignItems: "center",
  padding: theme.spacing(1, 2),
}));

type Props = {
  title: string;
  StartIcon?: ElementType;
  CloseIcon?: ElementType;
  onClose?: () => void;
};

const DialogHeader = ({ title, StartIcon, CloseIcon, onClose }: Props) => {
  const renderCloseIcon = () => {
    if (!onClose) return null;

    return (
      <IconButton onClick={onClose}>
        {CloseIcon ? <CloseIcon htmlColor={theme.palette.primary.contrastText} /> : <Close htmlColor={theme.palette.primary.contrastText} />}
      </IconButton>
    );
  };
  return (
    <StyledDialogHeader>
      <StyledDialogHeaderContent spacing={2}>
        {StartIcon && <StartIcon htmlColor={theme.palette.primary.contrastText} />}
        <Typography alignSelf="center" variant="h6" color={theme.palette.primary.contrastText}>
          {title}
        </Typography>
      </StyledDialogHeaderContent>
      {renderCloseIcon()}
    </StyledDialogHeader>
  );
};

export default DialogHeader;
