import { Close } from "@mui/icons-material";
import { IconButton, Stack, Typography, styled } from "@mui/material";
import { ElementType } from "react";
import { theme } from "../../theme";

const StyledDialogHeader = styled(Stack, {
  label: "styled-dialog-header",
})(({ theme }) => ({
  position: "sticky",
  top: 0,
  zIndex: 1,
  backgroundColor: theme.palette.primary.light,
  justifyContent: "space-between",
}));

const StyledDialogHeaderContent = styled(Stack, {
  label: "styled-dialog-header-content",
})(({ theme }) => ({
  alignItems: "center",
  padding: theme.spacing(1, 2),
}));

type Props = {
  title: string;
  closeTooltip?: string;
  StartIcon?: ElementType;
  CloseIcon?: ElementType;
  onClose?: () => void;
  overallDistanceInMeters?: number;
};

const DialogHeader = ({ title, closeTooltip, StartIcon, CloseIcon, overallDistanceInMeters, onClose }: Props) => {
  const renderCloseIcon = () => {
    if (!onClose) return null;

    return (
      <IconButton onClick={onClose} title={closeTooltip}>
        {CloseIcon ? (
          <CloseIcon htmlColor={theme.palette.primary.contrastText} />
        ) : (
          <Close htmlColor={theme.palette.primary.contrastText} />
        )}
      </IconButton>
    );
  };
  return (
    <StyledDialogHeader direction="row">
      <StyledDialogHeaderContent direction="row" spacing={1}>
        {StartIcon && <StartIcon htmlColor={theme.palette.primary.contrastText} />}
        <Typography alignSelf="center" variant="h6" color={theme.palette.primary.contrastText}>
          {title}
        </Typography>
        {
          <Typography variant="body2" color={theme.palette.primary.contrastText}>
            {`Reitin pituus: ${overallDistanceInMeters ? (overallDistanceInMeters / 1000).toFixed(2) : "-"} km`}
          </Typography>
        }
      </StyledDialogHeaderContent>
      {renderCloseIcon()}
    </StyledDialogHeader>
  );
};

export default DialogHeader;
