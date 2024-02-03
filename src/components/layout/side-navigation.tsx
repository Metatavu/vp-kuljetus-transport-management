import { Stack, Paper, List, ListItemButton, ListItemIcon, Typography, Divider } from "@mui/material";
import { useMatches, useNavigate } from "@tanstack/react-router";
import { SideNavigationItem } from "src/types";

type Props = {
  navigationItems: SideNavigationItem[];
};

const SideNavigation = ({ navigationItems }: Props) => {
  const matches = useMatches();
  const navigate = useNavigate();

  const renderDivider = (selected: boolean) => {
    if (selected) {
      return <Divider flexItem orientation="vertical" sx={{ borderRightWidth: "2px", borderColor: "#00414F" }} />;
    }
  };

  const renderNavigationItem = (item: SideNavigationItem) => {
    const selected = matches.some((match) => match.pathname === item.path);
    const color = selected ? "#00414F" : undefined;

    return (
      <Stack direction="row" justifyContent="space-between">
        <ListItemButton
          selected={selected}
          key={item.path}
          dense
          sx={{ justifyContent: "flex-start", padding: "9px 16px" }}
          onClick={() => navigate({ to: item.path })}
        >
          <ListItemIcon sx={{ color: color }}>{item.icon}</ListItemIcon>
          <Typography textTransform="uppercase" color={color} fontSize="14px">
            {item.title}
          </Typography>
        </ListItemButton>
        {renderDivider(selected)}
      </Stack>
    );
  };

  return (
    <Paper sx={{ width: "248px", position: "sticky", borderRadius: 0 }}>
      <List dense>{navigationItems.map(renderNavigationItem)}</List>
    </Paper>
  );
};

export default SideNavigation;
