import { Box, styled } from "@mui/material";

const ViewContainer = styled(Box, {
  label: "layout-view-container",
})(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  flex: 1,
  width: "100%",
  overflow: "auto",
  padding: theme.spacing(2),
}));

export default ViewContainer;
