import { Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

function ChangeLog() {
  const { t } = useTranslation();

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>{t("workingHours.workingDays.changeLog.time")}</TableCell>
          <TableCell align="center">{t("workingHours.workingDays.changeLog.user")}</TableCell>
          <TableCell align="center">{t("workingHours.workingDays.changeLog.reviewed")}</TableCell>
          <TableCell>{t("workingHours.workingDays.changeLog.affectedDates")}</TableCell>
          <TableCell>{t("workingHours.workingDays.changeLog.explanation")}</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>3.5.2024 09:50:33</TableCell>
          <TableCell align="center">
            <Typography>Jere</Typography>
          </TableCell>
          <TableCell align="center">
            <Typography>Teemu</Typography>
          </TableCell>
          <TableCell align="left">
            <Typography>30.4., 1.5., 3.5.</Typography>
          </TableCell>
          <TableCell>Poissaolokoodi SL asetettiin</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}

export default ChangeLog;
