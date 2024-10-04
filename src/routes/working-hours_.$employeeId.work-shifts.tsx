import { ArrowBack, Print, Save, Send } from "@mui/icons-material";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import { Outlet, createFileRoute } from "@tanstack/react-router";
import AggregationsTable from "components/working-hours/aggregations-table";
import ChangeLog from "components/working-hours/change-log";
import WorkShiftRow from "components/working-hours/work-shift-row";
import WorkShiftsTableHeader from "components/working-hours/work-shifts-table-header";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/working-hours/$employeeId/work-shifts")({
  component: WorkShifts,
  staticData: { breadcrumbs: ["workingHours.title", "workingHours.workingDays.title"] },
});

// Styled root component
const Root = styled(Stack, {
  label: "working-days-root",
})(({ theme }) => ({
  height: "100%",
  width: "100%",
  overflow: "auto",
  backgroundColor: theme.palette.background.default,
  flexDirection: "column",
  // Default padding for smaller screens
  padding: 0,
  // Apply padding for larger screens using breakpoints
  [theme.breakpoints.up(2100)]: {
    padding: theme.spacing(2),
    paddingTop: 0,
  },
}));

// Styled toolbar container component
const ToolbarContainer = styled(Stack, {
  label: "working-days-toolbar-container",
})(({ theme }) => ({
  alignItems: "center",
  gap: theme.spacing(2),
  flexDirection: "row",
  flex: 1,
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2),
  [theme.breakpoints.up(1800)]: {
    paddingBottom: theme.spacing(2),
  },
}));

// Styled toolbar container component
const BottomAreaContainer = styled(Stack, {
  label: "working-days-bottom-area-container",
})(({ theme }) => ({
  marginTop: theme.spacing(2),
  paddingBottom: theme.spacing(4),
  gap: theme.spacing(2),
  // Default stack direction for smaller screens
  flexDirection: "column",
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  // Stack direction row for larger screens
  [theme.breakpoints.up(2200)]: {
    flexDirection: "row",
    paddingRight: 0,
    paddingLeft: 0,
  },
}));

// Styled table header component
const TableHeader = styled(Stack, {
  label: "working-days-table-header",
})(({ theme }) => ({
  gap: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  padding: theme.spacing(1, 2),
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
}));

// Styled table container
const TableContainer = styled(Stack, {
  label: "work-shifts-table-container",
})(({ theme }) => ({
  backgroundColor: "#EDF3F5",
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

function WorkShifts() {
  const { t } = useTranslation();
  const navigate = Route.useNavigate();

  const renderToolbar = () => {
    return (
      <Stack direction="row" justifyContent="space-between">
        <ToolbarContainer>
          <IconButton onClick={() => navigate({ to: "../.." })} title={t("tooltips.backToWorkingHours")}>
            <ArrowBack />
          </IconButton>
          <TextField sx={{ maxWidth: 300 }} select variant="standard" label={t("workingHours.workingDays.employee")} />
          <TextField
            sx={{ maxWidth: 300 }}
            select
            variant="standard"
            label={t("workingHours.workingHourBalances.payPeriod")}
          />
        </ToolbarContainer>
        <Stack direction="row" alignItems="end" gap={2} p={2}>
          <Button size="small" variant="outlined" endIcon={<Print />}>
            {t("workingHours.workingDays.print")}
          </Button>
          <Button size="small" variant="contained" disabled={true} endIcon={<Send />}>
            {t("workingHours.workingDays.sendToPayroll")}
          </Button>
          <Button size="small" variant="contained" disabled={true} endIcon={<Save />}>
            {t("save")}
          </Button>
        </Stack>
      </Stack>
    );
  };

  return (
    <>
      <Root>
        {renderToolbar()}
        <Paper elevation={0}>
          <Stack>
            <TableHeader>
              <Typography variant="subtitle1">{"Su 28.4. 00.00 - La 11.5. 24:00"}</Typography>
              <Stack spacing={4} direction="row" alignItems="center">
                <FormControlLabel
                  control={<Checkbox title="Merkitse kaikki tarkistetuiksi" />}
                  label={t("workingHours.workingDays.table.inspected")}
                />
                <Box minWidth={245}>
                  <Typography variant="body2">{"Tiedot tallennettu 11.5.2021 12:00"}</Typography>
                </Box>
              </Stack>
            </TableHeader>
            <TableContainer>
              <WorkShiftsTableHeader />
              {
                // TODO: Render work days for set time period by salarygroup
                Array.from({ length: 14 }).map((index) => (
                  <WorkShiftRow
                    key={`${index}_${Math.random()}`}
                    onClick={() => navigate({ to: "work-shift-details" })}
                  />
                ))
              }
            </TableContainer>
          </Stack>
        </Paper>
        <BottomAreaContainer>
          <Paper elevation={0} sx={{ display: "flex", flex: 2 }}>
            <Stack flex={1}>
              <TableHeader>
                <Typography variant="subtitle1">{"Selected year and date range"}</Typography>
              </TableHeader>
              <AggregationsTable />
            </Stack>
          </Paper>
          <Paper elevation={0} sx={{ display: "flex", flex: 1 }}>
            <Stack flex={1}>
              <TableHeader>
                <Typography variant="subtitle1">{t("workingHours.workingDays.changeLog.title")}</Typography>
              </TableHeader>
              <ChangeLog />
            </Stack>
          </Paper>
        </BottomAreaContainer>
      </Root>
      <Outlet />
    </>
  );
}

export default WorkShifts;
