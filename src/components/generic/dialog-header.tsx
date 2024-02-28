import { Close } from "@mui/icons-material";
import { IconButton, Stack, Typography, styled } from "@mui/material";
import { ElementType } from "react";

const StyledDialogHeader = styled(Stack, {
  label: "styled-dialog-header",
})(() => ({
  flexDirection: "row",
  padding: "0px 8px 0px 16px",
  height: "42px",
  backgroundColor: "#4E8A9C",
  justifyContent: "space-between",
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
        {CloseIcon ? <CloseIcon htmlColor="#ffffff" /> : <Close htmlColor="#ffffff" />}
      </IconButton>
    );
  };
  return (
    <StyledDialogHeader sx={{ position: "sticky", top: 0, zIndex: 1 }}>
      <Stack spacing={2} direction="row" alignItems="center">
        {StartIcon && <StartIcon htmlColor="#ffffff" />}
        <Typography alignSelf="center" variant="h6" color="#ffffff">
          {title}
        </Typography>
      </Stack>
      {renderCloseIcon()}
    </StyledDialogHeader>
  );
};

export default DialogHeader;
