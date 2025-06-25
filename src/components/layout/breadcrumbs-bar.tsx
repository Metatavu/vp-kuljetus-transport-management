import { Breadcrumbs, styled, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { Link, useLoaderData, useMatches } from "@tanstack/react-router";

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
  const deepestRouteId = useMatches({ select: (matches) => matches.at(-1)?.routeId });
  if (!deepestRouteId) throw new Error("No match found");

  const loaderData = useLoaderData({ from: deepestRouteId });
  const breadcrumbs = loaderData && "breadcrumbs" in loaderData ? loaderData.breadcrumbs : [];

  return (
    <BreadCrumbBar>
      <Breadcrumbs aria-label="breadcrumb" sx={{ color: "#ffffff" }}>
        {breadcrumbs.map(({ label, route }, index) => {
          const key = `breadcrumb-${index}`;

          return route ? (
            <Link href={route} key={key} style={{ color: "#fff" }}>
              <Typography variant="h6" sx={{ userSelect: "none" }}>
                {label}
              </Typography>
            </Link>
          ) : (
            <Typography key={key} color="#ffffff" variant={index === 0 ? "body2" : "h6"} sx={{ userSelect: "none" }}>
              {label}
            </Typography>
          );
        })}
      </Breadcrumbs>
    </BreadCrumbBar>
  );
};

export default BreadcrumbsBar;
