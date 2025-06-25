import { Document, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { type Employee, type SalaryPeriodTotalWorkHours, WorkType } from "generated/client";
import { DateTime } from "luxon";
import { useTranslation } from "react-i18next";
import type { EmployeeWorkHoursFormRow } from "src/types";
import LocalizationUtils from "src/utils/localization-utils";
import WorkShiftsUtils from "src/utils/workshift-utils";
import logo from "../../assets/vp-kuljetus-logo.jpeg";

// Define styles
const styles = StyleSheet.create({
  page: {
    padding: 0,
    fontSize: 9,
    fontFamily: "Helvetica",
    paddingTop: 10,
  },
  boldText: {
    fontFamily: "Helvetica-Bold",
  },
  header: {
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTextContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    height: "40px",
    width: "150px",
  },
  headerCellText: {
    fontSize: 7,
  },
  cellText: {
    fontSize: 8,
  },
  table: {
    width: "100%",
    marginBottom: 10,
    padding: 4,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    borderLeftWidth: 1,
    borderLeftColor: "#e0e0e0",
  },
  timeTableCell: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: "#e0e0e0",
    paddingLeft: 1,
    paddingRight: 0,
    paddingTop: 4,
    paddingBottom: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  tableCell: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: "#e0e0e0",
    padding: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  tableHeader: {
    flexDirection: "row",
    borderLeftWidth: 1,
    borderLeftColor: "#e0e0e0",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  summaryTable: {
    marginTop: 10,
    padding: 4,
  },
  footer: {
    marginTop: 30,
    textAlign: "center",
  },
});

interface Props {
  employee?: Employee;
  workShiftsData: EmployeeWorkHoursFormRow[];
  employeeAggregatedHours?: SalaryPeriodTotalWorkHours | undefined;
  workingPeriodsForEmployee: { start: Date; end: Date };
}

const WorkingHoursDocument = ({
  employee,
  workShiftsData,
  workingPeriodsForEmployee,
  employeeAggregatedHours,
}: Props) => {
  const { t } = useTranslation();

  if (!employee || !workShiftsData || !employeeAggregatedHours) {
    return null;
  }

  const renderAggregationsTableTitle = () => {
    if (!workingPeriodsForEmployee) return null;

    const start = DateTime.fromJSDate(workingPeriodsForEmployee.start).toFormat("dd.MM");
    const end = DateTime.fromJSDate(workingPeriodsForEmployee.end).toFormat("dd.MM");
    return (
      <View style={{ paddingLeft: 10 }}>
        <Text>
          {t("workingHours.workingDays.aggregationsTable.title", {
            year: workingPeriodsForEmployee.start.getFullYear(),
            start: start,
            end: end,
          })}
        </Text>
      </View>
    );
  };

  // Render header
  const renderHeader = () => (
    <View style={styles.tableHeader}>
      <View style={styles.timeTableCell}>
        <Text style={styles.headerCellText}>{t("workingHours.workingDays.table.date")}</Text>
      </View>
      <View style={styles.timeTableCell}>
        <Text style={styles.headerCellText}>{t("workingHours.workingDays.table.workStarted")}</Text>
      </View>
      <View style={styles.timeTableCell}>
        <Text style={styles.headerCellText}>{t("workingHours.workingDays.table.workEnded")}</Text>
      </View>
      <View style={styles.timeTableCell}>
        <Text style={styles.headerCellText}>{t("workingHours.workingDays.table.workingHours")}</Text>
      </View>
      <View style={styles.timeTableCell}>
        <Text style={styles.headerCellText}>{t("workingHours.workingDays.table.unpaidBreak")}</Text>
      </View>
      <View style={styles.timeTableCell}>
        <Text style={styles.headerCellText}>{t("workingHours.workingDays.table.payableWorkingHours")}</Text>
      </View>
      <View style={styles.timeTableCell}>
        <Text style={styles.headerCellText}>{t("workingHours.workingDays.table.waitingTime")}</Text>
      </View>
      <View style={styles.timeTableCell}>
        <Text style={styles.headerCellText}>{t("workingHours.workingDays.table.eveningWork")}</Text>
      </View>
      <View style={styles.timeTableCell}>
        <Text style={styles.headerCellText}>{t("workingHours.workingDays.table.nightWork")}</Text>
      </View>
      <View style={styles.timeTableCell}>
        <Text style={styles.headerCellText}>{t("workingHours.workingDays.table.holidayBonus")}</Text>
      </View>
      <View style={styles.timeTableCell}>
        <Text style={styles.headerCellText}>{t("workingHours.workingDays.table.taskSpecificBonus")}</Text>
      </View>
      <View style={styles.timeTableCell}>
        <Text style={styles.headerCellText}>{t("workingHours.workingDays.table.freezerBonus")}</Text>
      </View>
      <View style={styles.timeTableCell}>
        <Text style={styles.headerCellText}>
          {t("workingHours.workingDays.aggregationsTable.absenceTypes.officialDuties")}
        </Text>
      </View>
      <View style={styles.timeTableCell}>
        <Text style={styles.headerCellText}>
          {t("workingHours.workingDays.aggregationsTable.absenceTypes.sickLeave")}
        </Text>
      </View>
      <View style={styles.timeTableCell}>
        <Text style={styles.headerCellText}>
          {t("workingHours.workingDays.aggregationsTable.trainingDuringWorkTime")}
        </Text>
      </View>
      <View style={styles.timeTableCell}>
        <Text style={styles.headerCellText}>{t("workingHours.workingDays.aggregationsTable.unpaid")}</Text>
      </View>
      <View style={styles.timeTableCell}>
        <Text style={styles.headerCellText}>{t("workingHours.workingDays.pdf.dayOffBonus")}</Text>
      </View>
      <View style={styles.timeTableCell}>
        <Text style={styles.headerCellText}>{t("workingHours.workingDays.table.absence")}</Text>
      </View>
      <View style={[styles.timeTableCell, { maxWidth: 30 }]}>
        <Text style={styles.headerCellText}>{t("workingHours.workingDays.table.dailyAllowance")}</Text>
      </View>
      <View style={[styles.timeTableCell, { maxWidth: 20 }]}>
        <Text style={styles.headerCellText}>{t("workingHours.workingDays.pdf.notes")}</Text>
      </View>
    </View>
  );

  const renderDayRow = (row: EmployeeWorkHoursFormRow) => (
    <View
      key={row.workShift.id ?? `${row.workShift.date}`}
      style={[
        styles.tableRow,
        { backgroundColor: DateTime.fromJSDate(row.workShift.date).isWeekend ? "#f0f0f0" : "#fff" },
      ]}
    >
      <View style={styles.timeTableCell}>
        <Text style={styles.cellText}>{DateTime.fromJSDate(row.workShift.date).toFormat("EEE dd.MM")}</Text>
      </View>
      <View style={styles.timeTableCell}>
        <Text style={styles.cellText}>
          {row.workShift.startedAt ? DateTime.fromJSDate(row.workShift.startedAt).toFormat("HH:mm") : ""}
        </Text>
      </View>
      <View style={styles.timeTableCell}>
        <Text style={styles.cellText}>
          {row.workShift.endedAt ? DateTime.fromJSDate(row.workShift.endedAt).toFormat("HH:mm") : ""}
        </Text>
      </View>
      <View style={styles.timeTableCell}>
        <Text style={styles.cellText}>{WorkShiftsUtils.getTotalWorkingTimeOnWorkShift(row.workShift)}</Text>
      </View>
      <View style={styles.timeTableCell}>
        <Text style={styles.cellText}>{WorkShiftsUtils.getUnpaidBreakHours(row.workShiftHours)}</Text>
      </View>
      <View style={styles.timeTableCell}>
        <Text style={styles.cellText}>
          {WorkShiftsUtils.getShiftsWorkHoursByType(row.workShiftHours, WorkType.PaidWork)}
        </Text>
      </View>
      <View style={styles.timeTableCell}>
        <Text style={styles.cellText}>
          {WorkShiftsUtils.getShiftsWorkHoursByType(row.workShiftHours, WorkType.Standby)}
        </Text>
      </View>
      <View style={styles.timeTableCell}>
        <Text style={styles.cellText}>
          {WorkShiftsUtils.getShiftsWorkHoursByType(row.workShiftHours, WorkType.EveningAllowance)}
        </Text>
      </View>
      <View style={styles.timeTableCell}>
        <Text style={styles.cellText}>
          {WorkShiftsUtils.getShiftsWorkHoursByType(row.workShiftHours, WorkType.NightAllowance)}
        </Text>
      </View>
      <View style={styles.timeTableCell}>
        <Text style={styles.cellText}>
          {WorkShiftsUtils.getShiftsWorkHoursByType(row.workShiftHours, WorkType.HolidayAllowance)}
        </Text>
      </View>
      <View style={styles.timeTableCell}>
        <Text style={styles.cellText}>
          {WorkShiftsUtils.getShiftsWorkHoursByType(row.workShiftHours, WorkType.JobSpecificAllowance)}
        </Text>
      </View>
      <View style={styles.timeTableCell}>
        <Text style={styles.cellText}>
          {WorkShiftsUtils.getShiftsWorkHoursByType(row.workShiftHours, WorkType.FrozenAllowance)}
        </Text>
      </View>
      <View style={styles.timeTableCell}>
        <Text style={styles.cellText}>
          {WorkShiftsUtils.getShiftsWorkHoursByType(row.workShiftHours, WorkType.OfficialDuties)}
        </Text>
      </View>
      <View style={styles.timeTableCell}>
        <Text style={styles.cellText}>
          {WorkShiftsUtils.getShiftsWorkHoursByType(row.workShiftHours, WorkType.SickLeave)}
        </Text>
      </View>
      <View style={styles.timeTableCell}>
        <Text style={styles.cellText}>
          {WorkShiftsUtils.getShiftsWorkHoursByType(row.workShiftHours, WorkType.Training)}
        </Text>
      </View>
      <View style={styles.timeTableCell}>
        <Text style={styles.cellText}>
          {WorkShiftsUtils.getShiftsWorkHoursByType(row.workShiftHours, WorkType.Unpaid)}
        </Text>
      </View>
      <View style={styles.timeTableCell}>
        <Text style={styles.cellText}>{row.workShift.dayOffWorkAllowance ? "kyllä" : ""}</Text>
      </View>
      <View style={styles.timeTableCell}>
        <Text style={styles.cellText}>
          {row.workShift.absence ? LocalizationUtils.getLocalizedAbsenceType(row.workShift.absence, t) : ""}
        </Text>
      </View>
      <View style={[styles.timeTableCell, { maxWidth: 30 }]}>
        <Text style={styles.cellText}>
          {row.workShift.perDiemAllowance
            ? LocalizationUtils.getPerDiemAllowanceType(row.workShift.perDiemAllowance, t)
            : ""}
        </Text>
      </View>
      <View style={[styles.timeTableCell, { maxWidth: 20, textAlign: "left" }]}>
        <Text style={[styles.cellText, { fontSize: 12 }]}>{row.workShift.notes ? "*" : ""}</Text>
      </View>
    </View>
  );

  const renderNotesFromWorkshifts = () => {
    const notes = workShiftsData.filter((row) => row.workShift.notes);
    if (notes.length === 0) {
      return null;
    }
    return (
      <View style={[styles.table, { marginTop: 10 }]}>
        <Text style={styles.boldText}>{t("workingHours.workingDays.table.remarks")}:</Text>
        <View style={[styles.tableHeader, { marginTop: 5 }]}>
          <View style={[styles.timeTableCell, { maxWidth: 90 }]}>
            <Text style={styles.headerCellText}>{t("workingHours.workingDays.table.date")}</Text>
          </View>
          <View style={[styles.timeTableCell, { alignItems: "flex-start", paddingLeft: 10 }]}>
            <Text style={styles.headerCellText}>{t("workingHours.workingDays.pdf.remark")}</Text>
          </View>
        </View>
        {notes.map((row) => (
          <View
            key={row.workShift.id ?? `${row.workShift.date}`}
            wrap={false}
            style={[
              styles.tableRow,
              {
                backgroundColor: DateTime.fromJSDate(row.workShift.date).isWeekend ? "#f0f0f0" : "#fff",
              },
            ]}
          >
            <View style={[styles.timeTableCell, { maxWidth: 90 }]}>
              <Text style={styles.cellText}>{DateTime.fromJSDate(row.workShift.date).toFormat("EEE dd.MM")}</Text>
            </View>
            <View style={[styles.timeTableCell, { alignItems: "flex-start", paddingLeft: 10, paddingRight: 10 }]}>
              <Text style={styles.cellText}>{row.workShift.notes}</Text>
            </View>
          </View>
        ))}
      </View>
    );
  };

  return (
    <Document>
      {/* First Page */}
      <Page size="A4" orientation="landscape" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Image style={styles.logo} src={logo} />
          <View style={styles.headerTextContent}>
            <Text style={styles.boldText}>
              {employee.firstName} {employee.lastName}
            </Text>
            <View style={{ marginLeft: "2cm", flexDirection: "row", gap: "0.5cm" }}>
              <Text>
                {t("workingHours.workingDays.pdf.reportTitle")} {renderAggregationsTableTitle()}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.table}>
          {renderHeader()}

          {workShiftsData.map((row) => renderDayRow(row))}
        </View>
      </Page>

      {/* Second page */}
      <Page size="A4" orientation="landscape" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Image style={styles.logo} src={logo} />
          <View style={styles.headerTextContent}>
            <Text style={styles.boldText}>
              {employee.firstName} {employee.lastName}
            </Text>
            <View style={{ marginLeft: "2cm", flexDirection: "row", gap: "0.5cm" }}>
              <Text>
                {t("workingHours.workingDays.pdf.reportTitle")} {renderAggregationsTableTitle()}
              </Text>
            </View>
          </View>
        </View>

        {/* Summary Table */}
        <View style={styles.summaryTable}>
          <View style={[styles.tableRow, { borderTop: "1px solid #e0e0e0" }]}>
            <View style={[styles.tableCell, { alignItems: "flex-start" }]}>
              <Text>{t("workingHours.workingDays.aggregationsTable.workingHours")}</Text>
            </View>
            <View style={[styles.tableCell, { maxWidth: 50 }]}>
              <Text style={styles.boldText}>{`${employeeAggregatedHours.workingHours.toFixed(2)} h`}</Text>
            </View>
            <View style={[styles.tableCell, { alignItems: "flex-start" }]}>
              <Text>{t("workingHours.workingDays.aggregationsTable.vacation")}</Text>
            </View>
            <View style={[styles.tableCell, { maxWidth: 50 }]}>
              <Text style={styles.boldText}>{`${employeeAggregatedHours.vacation.toFixed(2)} h`}</Text>
            </View>
            <View style={[styles.tableCell, { alignItems: "flex-start" }]}>
              <Text>{t("workingHours.workingDays.aggregationsTable.partialDailyAllowance")}</Text>
            </View>
            <View style={[styles.tableCell, { maxWidth: 50 }]}>
              <Text style={styles.boldText}>{`${employeeAggregatedHours.partialDailyAllowance} pv`}</Text>
            </View>
            <View style={[styles.tableCell, { alignItems: "flex-start" }]}>
              <Text style={styles.boldText} />
            </View>
            <View style={[styles.tableCell, { maxWidth: 50 }]}>
              <Text style={styles.boldText} />
            </View>
            <View style={[styles.tableCell, { opacity: 0 }]} />
          </View>
          <View style={styles.tableRow}>
            <View style={[styles.tableCell, { alignItems: "flex-start" }]}>
              <Text>{t("workingHours.workingDays.aggregationsTable.workTime")}</Text>
            </View>
            <View style={[styles.tableCell, { maxWidth: 50 }]}>
              <Text style={styles.boldText}>{`${WorkShiftsUtils.getRegularWorkingHoursOnWorkPeriod(
                employee,
                employeeAggregatedHours.unpaid ?? 0,
              )} h`}</Text>
            </View>
            <View style={[styles.tableCell, { alignItems: "flex-start" }]}>
              <Text>{t("workingHours.workingDays.aggregationsTable.unpaid")}</Text>
            </View>
            <View style={[styles.tableCell, { maxWidth: 50 }]}>
              <Text style={styles.boldText}>{`${employeeAggregatedHours.unpaid.toFixed(2)} h`}</Text>
            </View>
            <View style={[styles.tableCell, { alignItems: "flex-start" }]}>
              <Text>{t("workingHours.workingDays.aggregationsTable.fullDayAllowance")}</Text>
            </View>
            <View style={[styles.tableCell, { maxWidth: 50 }]}>
              <Text style={styles.boldText}>{`${employeeAggregatedHours.fullDailyAllowance} pv`}</Text>
            </View>
            <View style={[styles.tableCell, { alignItems: "flex-start" }]}>
              <Text />
            </View>
            <View style={[styles.tableCell, { maxWidth: 50 }]}>
              <Text style={styles.boldText} />
            </View>
            <View style={[styles.tableCell, { opacity: 0 }]} />
          </View>
          <View style={styles.tableRow}>
            <View style={[styles.tableCell, { alignItems: "flex-start" }]}>
              <Text>{t("workingHours.workingDays.aggregationsTable.overtimeHalf")}</Text>
            </View>
            <View style={[styles.tableCell, { maxWidth: 50 }]}>
              <Text style={styles.boldText}>{`${employeeAggregatedHours.overTimeHalf.toFixed(2)} h`}</Text>
            </View>
            <View style={[styles.tableCell, { alignItems: "flex-start" }]}>
              <Text>{t("workingHours.workingDays.aggregationsTable.holiday")}</Text>
            </View>
            <View style={[styles.tableCell, { maxWidth: 50 }]}>
              <Text style={styles.boldText}>{`${employeeAggregatedHours.holiday.toFixed(2)} h`}</Text>
            </View>
            <View style={[styles.tableCell, { alignItems: "flex-start" }]}>
              <Text style={styles.boldText} />
            </View>
            <View style={[styles.tableCell, { maxWidth: 50 }]}>
              <Text style={styles.boldText} />
            </View>
            <View style={[styles.tableCell, { opacity: 0 }]} />
            <View style={[styles.tableCell, { maxWidth: 50, opacity: 0 }]}>
              <Text style={styles.boldText} />
            </View>
            <View style={[styles.tableCell, { opacity: 0 }]} />
          </View>
          <View style={styles.tableRow}>
            <View style={[styles.tableCell, { alignItems: "flex-start" }]}>
              <Text>{t("workingHours.workingDays.aggregationsTable.overtimeFull")}</Text>
            </View>
            <View style={[styles.tableCell, { maxWidth: 50 }]}>
              <Text style={styles.boldText}>{`${employeeAggregatedHours.overTimeFull.toFixed(2)} h`}</Text>
            </View>
            <View style={[styles.tableCell, { alignItems: "flex-start" }]}>
              <Text>{"Vapaapäivätyön lisä (VPTL)"}</Text>
            </View>
            <View style={[styles.tableCell, { maxWidth: 50 }]}>
              <Text style={styles.boldText}>{`${employeeAggregatedHours.dayOffBonus.toFixed(2)} h`}</Text>
            </View>
            <View style={[styles.tableCell, { alignItems: "flex-start" }]}>
              <Text>{t("workingHours.workingDays.aggregationsTable.fillingHours")}</Text>
            </View>
            <View style={[styles.tableCell, { maxWidth: 50 }]}>
              <Text style={styles.boldText}>{`${employeeAggregatedHours.fillingHours.toFixed(2)} h`}</Text>
            </View>
            <View style={[styles.tableCell, { opacity: 0 }]} />
            <View style={[styles.tableCell, { maxWidth: 50, opacity: 0 }]}>
              <Text />
            </View>
            <View style={[styles.tableCell, { opacity: 0 }]} />
          </View>
          <View style={styles.tableRow}>
            <View style={[styles.tableCell, { alignItems: "flex-start" }]}>
              <Text>{t("workingHours.workingDays.aggregationsTable.nightWork")}</Text>
            </View>
            <View style={[styles.tableCell, { maxWidth: 50 }]}>
              <Text style={styles.boldText}>{`${employeeAggregatedHours.nightWork.toFixed(2)} h`}</Text>
            </View>
            <View style={[styles.tableCell, { alignItems: "flex-start" }]}>
              <Text>{t("workingHours.workingDays.aggregationsTable.pekkanens")}</Text>
            </View>
            <View style={[styles.tableCell, { maxWidth: 50 }]}>
              <Text style={styles.boldText}>{`${employeeAggregatedHours.compensatoryLeave.toFixed(2)} h`}</Text>
            </View>
            <View style={[styles.tableCell, { alignItems: "flex-start" }]}>
              <Text>{t("workingHours.workingDays.aggregationsTable.absenceTypes.officialDuties")}</Text>
            </View>
            <View style={[styles.tableCell, { maxWidth: 50 }]}>
              <Text style={styles.boldText}>{`${employeeAggregatedHours.responsibilities.toFixed(2)} h`}</Text>
            </View>
            <View style={[styles.tableCell, { opacity: 0 }]} />
            <View style={[styles.tableCell, { maxWidth: 50, opacity: 0 }]}>
              <Text />
            </View>
            <View style={[styles.tableCell, { opacity: 0 }]} />
          </View>
          <View style={styles.tableRow}>
            <View style={[styles.tableCell, { alignItems: "flex-start" }]}>
              <Text>{t("workingHours.workingDays.aggregationsTable.eveningWork")}</Text>
            </View>
            <View style={[styles.tableCell, { maxWidth: 50 }]}>
              <Text style={styles.boldText}>{`${employeeAggregatedHours.eveningWork.toFixed(2)} h`}</Text>
            </View>
            <View style={[styles.tableCell, { alignItems: "flex-start" }]}>
              <Text>{t("workingHours.workingDays.aggregationsTable.sickHours")}</Text>
            </View>
            <View style={[styles.tableCell, { maxWidth: 50 }]}>
              <Text style={styles.boldText}>{`${employeeAggregatedHours.sickHours.toFixed(2)} h`}</Text>
            </View>
            <View style={[styles.tableCell, { alignItems: "flex-start" }]}>
              <Text>{t("workingHours.workingDays.aggregationsTable.trainingDuringWorkTime")}</Text>
            </View>
            <View style={[styles.tableCell, { maxWidth: 50 }]}>
              <Text style={styles.boldText}>{`${employeeAggregatedHours.trainingDuringWorkTime.toFixed(2)} h`}</Text>
            </View>
            <View style={[styles.tableCell, { opacity: 0 }]} />
            <View style={[styles.tableCell, { maxWidth: 50, opacity: 0 }]}>
              <Text />
            </View>
            <View style={[styles.tableCell, { opacity: 0 }]} />
          </View>
        </View>

        {/* Notes */}
        {renderNotesFromWorkshifts()}

        {/* Footer */}
        <View style={styles.footer}>
          <Text>
            {t("workingHours.workingDays.pdf.reportPrinted")} {DateTime.now().toFormat("EEEE dd.MM")}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default WorkingHoursDocument;
