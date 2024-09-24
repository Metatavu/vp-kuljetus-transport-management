import { Box, Breadcrumbs, Typography, styled } from "@mui/material";
import { useRouter } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { RouterContext } from "src/routes/__root";
import DataValidation from "utils/data-validation-utils";

const BreadCrumbBar = styled(Box, {
  label: "styled-breadcrumb-bar",
})(({ theme }) => ({
  backgroundColor: theme.palette.primary.light,
  padding: theme.spacing(0.5, 3),
}));

const BreadcrumbsBar = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const breadcrumbs = router.state.matches
    .flatMap(({ routeContext }) => (routeContext as RouterContext).breadcrumbs)
    .filter(DataValidation.validateValueIsNotUndefinedNorNull);

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
