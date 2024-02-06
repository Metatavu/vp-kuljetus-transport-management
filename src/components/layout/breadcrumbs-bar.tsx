import { Box, Breadcrumbs, Typography } from "@mui/material";
import { useRouter } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { RouterContext } from "src/routes/__root";
import DataValidation from "utils/data-validation-utils";

const BreadcrumbsBar = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const breadcrumbs = router.state.matches
    .map(({ routeContext }) => (routeContext as RouterContext).breadcrumb)
    .filter(DataValidation.validateValueIsNotUndefinedNorNull);

  return (
    <Box height="32px" padding="4px 32px" bgcolor="#4E8A9C">
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
    </Box>
  );
};

export default BreadcrumbsBar;
