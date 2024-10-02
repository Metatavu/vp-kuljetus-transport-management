import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
} from "@mui/material";
import DialogHeader from "components/generic/dialog-header";
import { WorkEventType } from "generated/client";
import { useTranslation } from "react-i18next";
import WorkEventRow from "./work-event-row";
import WorkShiftMap from "./work-shift-map";

type Props = {
  onClose: () => void;
};

const WorkShiftDialog = ({ onClose }: Props) => {
  const { t } = useTranslation();

  return (
    <Dialog fullWidth={true} maxWidth="lg" open={true} onClose={onClose} PaperProps={{ sx: { m: 0, borderRadius: 0 } }}>
      <DialogHeader
        closeTooltip={t("tooltips.closeDialog")}
        title={t("workingHours.workingDays.workShiftDialog.title")}
        onClose={onClose}
      />
      <DialogContent sx={{ p: 0 }}>
        <Stack direction="row">
          <WorkShiftMap />
          <Box display="flex" flex={1} maxHeight={600}>
            <TableContainer>
              <Table stickyHeader>
                <TableHead>
                  <TableCell>{t("workingHours.workingDays.workShiftDialog.time")}</TableCell>
                  <TableCell align="center">{t("workingHours.workingDays.workShiftDialog.vehicle")}</TableCell>
                  <TableCell>{t("workingHours.workingDays.workShiftDialog.event")}</TableCell>
                  <TableCell align="center">{t("workingHours.workingDays.workShiftDialog.duration")}</TableCell>
                  <TableCell align="center">{t("workingHours.workingDays.workShiftDialog.distance")}</TableCell>
                </TableHead>
                <TableBody>
                  {/* TODO: Render corresponding work events */}
                  <WorkEventRow
                    type={WorkEventType.ShiftStart}
                    startTime="07.30"
                    vehicle={null}
                    duration=""
                    distance={null}
                  />
                  <WorkEventRow
                    type={WorkEventType.OtherWork}
                    startTime="07.30"
                    vehicle={21}
                    duration="00:20"
                    distance={null}
                  />
                  <WorkEventRow
                    type={WorkEventType.Drive}
                    startTime="07.50"
                    vehicle={21}
                    duration="00:20"
                    distance="0,5 km"
                  />
                  <WorkEventRow
                    type={WorkEventType.Logout}
                    startTime="07.50"
                    vehicle={21}
                    duration="00:20"
                    distance={null}
                  />
                  <WorkEventRow
                    type={WorkEventType.Unknown}
                    startTime="07.50"
                    vehicle={null}
                    duration="00:20"
                    distance={null}
                  />
                  <WorkEventRow
                    type={WorkEventType.Login}
                    startTime="07.50"
                    vehicle={21}
                    duration="00:20"
                    distance={null}
                  />
                  <WorkEventRow
                    type={WorkEventType.Drive}
                    startTime="07.50"
                    vehicle={21}
                    duration="00:20"
                    distance="0,5 km"
                  />
                  <WorkEventRow
                    type={WorkEventType.ShiftEnd}
                    startTime="07.30"
                    vehicle={null}
                    duration=""
                    distance={null}
                  />
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button disabled={true} variant="outlined">
          {t("undoChanges")}
        </Button>
        <Button disabled={true}>{t("saveChanges")}</Button>
        <Button onClick={onClose} color="primary">
          {t("close")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WorkShiftDialog;
