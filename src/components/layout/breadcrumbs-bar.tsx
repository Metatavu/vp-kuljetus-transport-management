import { Breadcrumbs, Typography, styled } from "@mui/material";
import { Stack } from "@mui/system";
import { Link, useMatches } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

const BreadCrumbBar = styled(Stack, {
  label: "styled-breadcrumb-bar",
})(({ theme }) => ({
  backgroundColor: theme.palette.primary.light,
  paddingLeft: theme.spacing(2),
  height: 32,
  flexDirection: "row",
  alignItems: "center",
}));

const BreadcrumbsBar = () => {
  const { t } = useTranslation();
  const matches = useMatches();
  const breadcrumbs = matches.flatMap((match) => match.staticData?.breadcrumbs ?? []);

  return (
    <BreadCrumbBar>
      <Breadcrumbs aria-label="breadcrumb" sx={{ color: "#ffffff" }}>
        {breadcrumbs.map((breadcrumb, index) => {
          const first = index === 0;
          const last = index === breadcrumbs.length - 1;
          return first || last ? (
            <Typography
              key={`breadcrumb-${index}`}
              color="#ffffff"
              variant={first ? "body2" : "h6"}
              sx={{ userSelect: "none" }}
            >
              {t(breadcrumb)}
            </Typography>
          ) : (
            <Link href="../" key={`breadcrumb-${index}`}>
              {t(breadcrumb)}
            </Link>
          );
        })}
      </Breadcrumbs>
    </BreadCrumbBar>
  );
};

export default BreadcrumbsBar;
