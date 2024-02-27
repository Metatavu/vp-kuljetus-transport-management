import { Close } from "@mui/icons-material";
import { IconButton, Stack, Typography, styled } from "@mui/material";

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
  onClose?: () => void;
};

const DialogHeader = ({ title, onClose }: Props) => {
  const renderCloseIcon = () => {
    if (!onClose) return null;

    return (
      <IconButton onClick={onClose}>
        <Close htmlColor="#ffffff" />
      </IconButton>
    );
  };
  return (
    <StyledDialogHeader>
      <Typography alignSelf="center" variant="h6" color="#ffffff">
        {title}
      </Typography>
      {renderCloseIcon()}
    </StyledDialogHeader>
  );
};

export default DialogHeader;
