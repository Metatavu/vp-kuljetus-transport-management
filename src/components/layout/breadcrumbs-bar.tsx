import { Box, Breadcrumbs, Typography } from "@mui/material";
import { useMatches } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

const BreadcrumbsBar = () => {
  const { t } = useTranslation("translation", { keyPrefix: "breadcrumbs" });
  const matches = useMatches();

  const breadcrumbs = matches.flatMap((match) => match.pathname.split("/")).filter(Boolean);

  return (
    <Box height="32px" padding="4px 32px" bgcolor="#4E8A9C">
      <Breadcrumbs sx={{ color: "#ffffff" }}>
        {breadcrumbs.map((breadcrumb, index) => (
          <Typography
            key={breadcrumb}
            color="#ffffff"
            sx={{ fontWeight: index === breadcrumbs.length - 1 ? "bold" : undefined }}
          >
            {/* TODO: Figure out how to type this param */}
            {t(breadcrumb)}
          </Typography>
        ))}
      </Breadcrumbs>
    </Box>
  );
};

export default BreadcrumbsBar;
