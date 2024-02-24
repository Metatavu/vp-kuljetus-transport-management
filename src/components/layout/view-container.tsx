import { Box, styled } from "@mui/material";

const ViewContainer = styled(Box, {
  label: "layout-view-container",
})(() => ({
  display: "flex",
  flexDirection: "column",
  flex: 1,
  width: "100%",
  overflow: "auto",
}));

export default ViewContainer;
