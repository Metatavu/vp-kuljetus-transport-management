import { Box, Breadcrumbs, Typography, styled } from "@mui/material";
import { useMatches } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

const BreadCrumbBar = styled(Box, {
  label: "styled-breadcrumb-bar",
})(({ theme }) => ({
  backgroundColor: theme.palette.primary.light,
  padding: theme.spacing(0.5, 3),
}));

const BreadcrumbsBar = () => {
  const { t } = useTranslation();
  const matches = useMatches();
  const breadcrumbs = matches.flatMap((match) => match.staticData?.breadcrumbs ?? []);

  return (
    // TODO: Make breadcrums work as links to previous pages according to MUI documentation
    <BreadCrumbBar>
      <Breadcrumbs sx={{ color: "#ffffff" }}>
        {breadcrumbs.map((breadcrumb, index) => (
          <Typography
            key={`breadcrumb-${index}`}
            color="#ffffff"
            sx={{ fontWeight: index === breadcrumbs.length - 1 ? "bold" : undefined }}
          >
            {t(breadcrumb)}
          </Typography>
        ))}
      </Breadcrumbs>
    </BreadCrumbBar>
  );
};

export default BreadcrumbsBar;
