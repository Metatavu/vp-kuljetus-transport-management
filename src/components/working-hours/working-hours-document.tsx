import { Document, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import logo from "../../assets/vp-kuljetus-logo.jpeg";

// Define styles
const styles = StyleSheet.create({
  page: {
    padding: 0,
    fontSize: 9,
    fontFamily: "Helvetica",
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

interface WorkingDayProps {
  isWeekend: boolean;
  date: string;
  shiftStarts: string;
  workStarted: string;
  workEnded: string;
  workingTime: string;
  unpaidBreak: string;
  payableWorkingTime: string;
  waitingTime: string;
  eveningWork: string;
  nightShift: string;
  holidayBonus: string;
  workSpecificBonus: string;
  freezerBonus: string;
  dayOffBonus: boolean;
  absence: string;
  vehicleNumber: string;
  dailyAllowance: string;
  notifications: string;
}

const WorkingHoursDocument = () => {
  // Render header
  const renderHeader = () => (
    <View style={styles.tableHeader}>
      <View style={styles.timeTableCell}>
        <Text style={styles.headerCellText}>Pvm</Text>
      </View>
      <View style={styles.timeTableCell}>
        <Text style={styles.headerCellText}>Vuoro alkaa</Text>
      </View>
      <View style={styles.timeTableCell}>
        <Text style={styles.headerCellText}>Työ alkoi</Text>
      </View>
      <View style={styles.timeTableCell}>
        <Text style={styles.headerCellText}>Työ päättyi</Text>
      </View>
      <View style={styles.timeTableCell}>
        <Text style={styles.headerCellText}>Työaika</Text>
      </View>
      <View style={styles.timeTableCell}>
        <Text style={styles.headerCellText}>Palkaton tauko</Text>
      </View>
      <View style={styles.timeTableCell}>
        <Text style={styles.headerCellText}>Maksettava työaika</Text>
      </View>
      <View style={styles.timeTableCell}>
        <Text style={styles.headerCellText}>Odotus</Text>
      </View>
      <View style={styles.timeTableCell}>
        <Text style={styles.headerCellText}>Iltatyö</Text>
      </View>
      <View style={styles.timeTableCell}>
        <Text style={styles.headerCellText}>Yötyö</Text>
      </View>
      <View style={styles.timeTableCell}>
        <Text style={styles.headerCellText}>Pyhälisä</Text>
      </View>
      <View style={styles.timeTableCell}>
        <Text style={styles.headerCellText}>Työkohtaisuuslisä</Text>
      </View>
      <View style={styles.timeTableCell}>
        <Text style={styles.headerCellText}>Pakastelisä</Text>
      </View>
      <View style={styles.timeTableCell}>
        <Text style={styles.headerCellText}>Vapaapäivätyön lisä</Text>
      </View>
      <View style={styles.timeTableCell}>
        <Text style={styles.headerCellText}>Poissaolo</Text>
      </View>
      <View style={[styles.timeTableCell, { maxWidth: 30 }]}>
        <Text style={styles.headerCellText}>Auto</Text>
      </View>
      <View style={[styles.timeTableCell, { maxWidth: 30 }]}>
        <Text style={styles.headerCellText}>Päiväraha</Text>
      </View>
      <View style={[styles.timeTableCell, { minWidth: 70 }]}>
        <Text style={styles.headerCellText}>Huomautuksia</Text>
      </View>
    </View>
  );

  const renderDayRow = ({
    isWeekend,
    date,
    shiftStarts,
    workStarted,
    workEnded,
    workingTime,
    unpaidBreak,
    payableWorkingTime,
    waitingTime,
    eveningWork,
    nightShift,
    holidayBonus,
    workSpecificBonus,
    freezerBonus,
    dayOffBonus,
    absence,
    vehicleNumber,
    dailyAllowance,
    notifications,
  }: WorkingDayProps) => (
    <View style={[styles.tableRow, { backgroundColor: isWeekend ? "#f0f0f0" : "#fff" }]}>
      <View style={styles.timeTableCell}>
        <Text style={styles.cellText}>{date}</Text>
      </View>
      <View style={styles.timeTableCell}>
        <Text style={styles.cellText}>{shiftStarts}</Text>
      </View>
      <View style={styles.timeTableCell}>
        <Text style={styles.cellText}>{workStarted}</Text>
      </View>
      <View style={styles.timeTableCell}>
        <Text style={styles.cellText}>{workEnded}</Text>
      </View>
      <View style={styles.timeTableCell}>
        <Text style={styles.cellText}>{workingTime}</Text>
      </View>
      <View style={styles.timeTableCell}>
        <Text style={styles.cellText}>{unpaidBreak}</Text>
      </View>
      <View style={styles.timeTableCell}>
        <Text style={styles.cellText}>{payableWorkingTime}</Text>
      </View>
      <View style={styles.timeTableCell}>
        <Text style={styles.cellText}>{waitingTime}</Text>
      </View>
      <View style={styles.timeTableCell}>
        <Text style={styles.cellText}>{eveningWork}</Text>
      </View>
      <View style={styles.timeTableCell}>
        <Text style={styles.cellText}>{nightShift}</Text>
      </View>
      <View style={styles.timeTableCell}>
        <Text style={styles.cellText}>{holidayBonus}</Text>
      </View>
      <View style={styles.timeTableCell}>
        <Text style={styles.cellText}>{workSpecificBonus}</Text>
      </View>
      <View style={styles.timeTableCell}>
        <Text style={styles.cellText}>{freezerBonus}</Text>
      </View>
      <View style={styles.timeTableCell}>
        <Text style={styles.cellText}>{dayOffBonus ? "kyllä" : ""}</Text>
      </View>
      <View style={styles.timeTableCell}>
        <Text style={styles.cellText}>{absence}</Text>
      </View>
      <View style={[styles.timeTableCell, { maxWidth: 30 }]}>
        <Text style={styles.cellText}>{vehicleNumber}</Text>
      </View>
      <View style={[styles.timeTableCell, { maxWidth: 30 }]}>
        <Text style={styles.cellText}>{dailyAllowance}</Text>
      </View>
      <View style={[styles.timeTableCell, { minWidth: 70, textAlign: "left" }]}>
        <Text style={[styles.cellText, { fontSize: 7 }]}>{notifications}</Text>
      </View>
    </View>
  );

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Image style={styles.logo} src={logo} />
          <View style={styles.headerTextContent}>
            <Text style={styles.boldText}>Etunimi Sukunimi</Text>
            <View style={{ marginLeft: "2cm", flexDirection: "row", gap: "0.5cm" }}>
              <Text>Työaikaraportti vuoden 2024 jaksolta viikot 46-47</Text>
              <Text style={styles.boldText}>Su 10.11.2024 - La 23.11.2024</Text>
            </View>
          </View>
        </View>

        <View style={styles.table}>
          {renderHeader()}

          {renderDayRow({
            isWeekend: true,
            date: "Su 10.11.",
            shiftStarts: "10:30",
            workStarted: "10:41",
            workEnded: "21:17",
            workingTime: "09:46",
            unpaidBreak: "00:19",
            payableWorkingTime: "10:16",
            waitingTime: "",
            eveningWork: "03:17",
            nightShift: "",
            holidayBonus: "10:16",
            workSpecificBonus: "",
            freezerBonus: "",
            dayOffBonus: false,
            absence: "",
            vehicleNumber: "21",
            dailyAllowance: "Osa",
            notifications: "",
          })}
          {renderDayRow({
            isWeekend: false,
            date: "Ma 11.11.",
            shiftStarts: "12:30",
            workStarted: "12:43",
            workEnded: "23:59",
            workingTime: "10:29",
            unpaidBreak: "00:16",
            payableWorkingTime: "10:59",
            waitingTime: "",
            eveningWork: "04:00",
            nightShift: "01:59",
            holidayBonus: "",
            workSpecificBonus: "",
            freezerBonus: "",
            dayOffBonus: false,
            absence: "",
            vehicleNumber: "21",
            dailyAllowance: "Osa",
            notifications: "",
          })}
          {renderDayRow({
            isWeekend: false,
            date: "Ti 12.11.",
            shiftStarts: "",
            workStarted: "",
            workEnded: "",
            workingTime: "",
            unpaidBreak: "",
            payableWorkingTime: "",
            waitingTime: "",
            eveningWork: "",
            nightShift: "",
            holidayBonus: "",
            workSpecificBonus: "",
            freezerBonus: "",
            dayOffBonus: false,
            absence: "",
            vehicleNumber: "",
            dailyAllowance: "",
            notifications: "",
          })}
          {renderDayRow({
            isWeekend: false,
            date: "Ke 13.11.",
            shiftStarts: "",
            workStarted: "",
            workEnded: "",
            workingTime: "",
            unpaidBreak: "",
            payableWorkingTime: "",
            waitingTime: "",
            eveningWork: "",
            nightShift: "",
            holidayBonus: "",
            workSpecificBonus: "",
            freezerBonus: "",
            dayOffBonus: false,
            absence: "",
            vehicleNumber: "",
            dailyAllowance: "",
            notifications: "",
          })}
          {renderDayRow({
            isWeekend: false,
            date: "To 14.11.",
            shiftStarts: "",
            workStarted: "",
            workEnded: "",
            workingTime: "",
            unpaidBreak: "",
            payableWorkingTime: "",
            waitingTime: "",
            eveningWork: "",
            nightShift: "",
            holidayBonus: "",
            workSpecificBonus: "",
            freezerBonus: "",
            dayOffBonus: false,
            absence: "",
            vehicleNumber: "",
            dailyAllowance: "",
            notifications: "",
          })}
          {renderDayRow({
            isWeekend: false,
            date: "Pe 15.11.",
            shiftStarts: "",
            workStarted: "",
            workEnded: "",
            workingTime: "",
            unpaidBreak: "",
            payableWorkingTime: "",
            waitingTime: "",
            eveningWork: "",
            nightShift: "",
            holidayBonus: "",
            workSpecificBonus: "",
            freezerBonus: "",
            dayOffBonus: false,
            absence: "",
            vehicleNumber: "",
            dailyAllowance: "",
            notifications: "",
          })}
          {renderDayRow({
            isWeekend: true,
            date: "La 16.11.",
            shiftStarts: "",
            workStarted: "",
            workEnded: "",
            workingTime: "",
            unpaidBreak: "",
            payableWorkingTime: "",
            waitingTime: "",
            eveningWork: "",
            nightShift: "",
            holidayBonus: "",
            workSpecificBonus: "",
            freezerBonus: "",
            dayOffBonus: false,
            absence: "",
            vehicleNumber: "",
            dailyAllowance: "",
            notifications: "",
          })}
          {renderDayRow({
            isWeekend: true,
            date: "Su 17.11.",
            shiftStarts: "",
            workStarted: "",
            workEnded: "",
            workingTime: "",
            unpaidBreak: "",
            payableWorkingTime: "",
            waitingTime: "",
            eveningWork: "",
            nightShift: "",
            holidayBonus: "",
            workSpecificBonus: "",
            freezerBonus: "",
            dayOffBonus: false,
            absence: "",
            vehicleNumber: "",
            dailyAllowance: "",
            notifications: "",
          })}
          {renderDayRow({
            isWeekend: false,
            date: "Ma 18.11.",
            shiftStarts: "",
            workStarted: "",
            workEnded: "",
            workingTime: "",
            unpaidBreak: "",
            payableWorkingTime: "",
            waitingTime: "",
            eveningWork: "",
            nightShift: "",
            holidayBonus: "",
            workSpecificBonus: "",
            freezerBonus: "",
            dayOffBonus: false,
            absence: "",
            vehicleNumber: "",
            dailyAllowance: "",
            notifications: "",
          })}
          {renderDayRow({
            isWeekend: false,
            date: "Ti 19.11.",
            shiftStarts: "",
            workStarted: "",
            workEnded: "",
            workingTime: "",
            unpaidBreak: "",
            payableWorkingTime: "",
            waitingTime: "",
            eveningWork: "",
            nightShift: "",
            holidayBonus: "",
            workSpecificBonus: "",
            freezerBonus: "",
            dayOffBonus: false,
            absence: "",
            vehicleNumber: "",
            dailyAllowance: "",
            notifications: "",
          })}
          {renderDayRow({
            isWeekend: false,
            date: "Ke 20.11.",
            shiftStarts: "",
            workStarted: "",
            workEnded: "",
            workingTime: "",
            unpaidBreak: "",
            payableWorkingTime: "",
            waitingTime: "",
            eveningWork: "",
            nightShift: "",
            holidayBonus: "",
            workSpecificBonus: "",
            freezerBonus: "",
            dayOffBonus: false,
            absence: "",
            vehicleNumber: "",
            dailyAllowance: "",
            notifications: "",
          })}
          {renderDayRow({
            isWeekend: false,
            date: "To 21.11.",
            shiftStarts: "",
            workStarted: "",
            workEnded: "",
            workingTime: "",
            unpaidBreak: "",
            payableWorkingTime: "",
            waitingTime: "",
            eveningWork: "",
            nightShift: "",
            holidayBonus: "",
            workSpecificBonus: "",
            freezerBonus: "",
            dayOffBonus: false,
            absence: "",
            vehicleNumber: "",
            dailyAllowance: "",
            notifications: "",
          })}
          {renderDayRow({
            isWeekend: false,
            date: "Pe 22.11.",
            shiftStarts: "",
            workStarted: "",
            workEnded: "",
            workingTime: "",
            unpaidBreak: "",
            payableWorkingTime: "",
            waitingTime: "",
            eveningWork: "",
            nightShift: "",
            holidayBonus: "",
            workSpecificBonus: "",
            freezerBonus: "",
            dayOffBonus: false,
            absence: "",
            vehicleNumber: "",
            dailyAllowance: "",
            notifications: "",
          })}
          {renderDayRow({
            isWeekend: true,
            date: "La 23.11.",
            shiftStarts: "",
            workStarted: "",
            workEnded: "",
            workingTime: "",
            unpaidBreak: "",
            payableWorkingTime: "",
            waitingTime: "",
            eveningWork: "",
            nightShift: "",
            holidayBonus: "",
            workSpecificBonus: "",
            freezerBonus: "",
            dayOffBonus: false,
            absence: "",
            vehicleNumber: "",
            dailyAllowance: "",
            notifications: "",
          })}
          {renderDayRow({
            isWeekend: true,
            date: "Su 24.11.",
            shiftStarts: "",
            workStarted: "",
            workEnded: "",
            workingTime: "",
            unpaidBreak: "",
            payableWorkingTime: "",
            waitingTime: "",
            eveningWork: "",
            nightShift: "",
            holidayBonus: "",
            workSpecificBonus: "",
            freezerBonus: "",
            dayOffBonus: false,
            absence: "",
            vehicleNumber: "",
            dailyAllowance: "",
            notifications: "",
          })}
          {renderDayRow({
            isWeekend: true,
            date: "Ma 25.11.",
            shiftStarts: "",
            workStarted: "",
            workEnded: "",
            workingTime: "",
            unpaidBreak: "",
            payableWorkingTime: "",
            waitingTime: "",
            eveningWork: "",
            nightShift: "",
            holidayBonus: "",
            workSpecificBonus: "",
            freezerBonus: "",
            dayOffBonus: false,
            absence: "",
            vehicleNumber: "",
            dailyAllowance: "",
            notifications: "",
          })}
        </View>
        <View style={{ paddingLeft: 10 }}>
          <Text style={styles.boldText}>Vuoden 2024 viikkojen 46 ja 47 tunnit yhteensä</Text>
        </View>

        {/* Summary Table */}
        <View style={styles.summaryTable}>
          <View style={[styles.tableRow, { borderTop: "1px solid #e0e0e0" }]}>
            <View style={[styles.tableCell, { alignItems: "flex-start" }]}>
              <Text>Työtunnit</Text>
            </View>
            <View style={[styles.tableCell, { maxWidth: 50 }]}>
              <Text style={styles.boldText}>80.00 h</Text>
            </View>
            <View style={[styles.tableCell, { alignItems: "flex-start" }]}>
              <Text>Loma</Text>
            </View>
            <View style={[styles.tableCell, { maxWidth: 50 }]}>
              <Text style={styles.boldText} />
            </View>
            <View style={[styles.tableCell, { alignItems: "flex-start" }]}>
              <Text>Osapäiväraha</Text>
            </View>
            <View style={[styles.tableCell, { maxWidth: 50 }]}>
              <Text style={styles.boldText} />
            </View>
            <View style={[styles.tableCell, { alignItems: "flex-start" }]}>
              <Text>Poissaolotunnit</Text>
            </View>
            <View style={[styles.tableCell, { maxWidth: 50 }]}>
              <Text style={styles.boldText} />
            </View>
            <View style={[styles.tableCell, { opacity: 0 }]} />
          </View>
          <View style={styles.tableRow}>
            <View style={[styles.tableCell, { alignItems: "flex-start" }]}>
              <Text>Säännöllinen työaika</Text>
            </View>
            <View style={[styles.tableCell, { maxWidth: 50 }]}>
              <Text style={styles.boldText}>80.00 h</Text>
            </View>
            <View style={[styles.tableCell, { alignItems: "flex-start" }]}>
              <Text>Palkaton</Text>
            </View>
            <View style={[styles.tableCell, { maxWidth: 50 }]}>
              <Text style={styles.boldText}>0.16 h</Text>
            </View>
            <View style={[styles.tableCell, { alignItems: "flex-start" }]}>
              <Text>Kokopäiväraha</Text>
            </View>
            <View style={[styles.tableCell, { maxWidth: 50 }]}>
              <Text style={styles.boldText} />
            </View>
            <View style={[styles.tableCell, { alignItems: "flex-start" }]}>
              <Text>Täyttötunnit</Text>
            </View>
            <View style={[styles.tableCell, { maxWidth: 50 }]}>
              <Text style={styles.boldText} />
            </View>
            <View style={[styles.tableCell, { opacity: 0 }]} />
          </View>
          <View style={styles.tableRow}>
            <View style={[styles.tableCell, { alignItems: "flex-start" }]}>
              <Text>50% ylityö</Text>
            </View>
            <View style={[styles.tableCell, { maxWidth: 50 }]}>
              <Text style={styles.boldText} />
            </View>
            <View style={[styles.tableCell, { alignItems: "flex-start" }]}>
              <Text>Pyhälisä</Text>
            </View>
            <View style={[styles.tableCell, { maxWidth: 50 }]}>
              <Text style={styles.boldText}>10.16 h</Text>
            </View>
            <View style={[styles.tableCell, { alignItems: "flex-start" }]}>
              <Text>Korotettu kokopäiväraha</Text>
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
              <Text>100% ylityö</Text>
            </View>
            <View style={[styles.tableCell, { maxWidth: 50 }]}>
              <Text style={styles.boldText} />
            </View>
            <View style={[styles.tableCell, { alignItems: "flex-start" }]}>
              <Text>Vapaapäivätyön lisä</Text>
            </View>
            <View style={[styles.tableCell, { maxWidth: 50 }]}>
              <Text style={styles.boldText} />
            </View>
            <View style={[styles.tableCell, { alignItems: "flex-start" }]}>
              <Text>Ulkomaan päiväraha</Text>
            </View>
            <View style={[styles.tableCell, { maxWidth: 50 }]}>
              <Text style={styles.boldText} />
            </View>
            <View style={[styles.tableCell, { opacity: 0 }]} />
            <View style={[styles.tableCell, { maxWidth: 50, opacity: 0 }]}>
              <Text />
            </View>
            <View style={[styles.tableCell, { opacity: 0 }]} />
          </View>
          <View style={styles.tableRow}>
            <View style={[styles.tableCell, { alignItems: "flex-start" }]}>
              <Text>20% yötyö</Text>
            </View>
            <View style={[styles.tableCell, { maxWidth: 50 }]}>
              <Text style={styles.boldText} />
            </View>
            <View style={[styles.tableCell, { alignItems: "flex-start" }]}>
              <Text>Pekkaset</Text>
            </View>
            <View style={[styles.tableCell, { maxWidth: 50 }]}>
              <Text style={styles.boldText} />
            </View>
            <View style={[styles.tableCell, { alignItems: "flex-start" }]}>
              <Text>Luottamustoimet</Text>
            </View>
            <View style={[styles.tableCell, { maxWidth: 50 }]}>
              <Text style={styles.boldText} />
            </View>
            <View style={[styles.tableCell, { opacity: 0 }]} />
            <View style={[styles.tableCell, { maxWidth: 50, opacity: 0 }]}>
              <Text />
            </View>
            <View style={[styles.tableCell, { opacity: 0 }]} />
          </View>
          <View style={styles.tableRow}>
            <View style={[styles.tableCell, { alignItems: "flex-start" }]}>
              <Text>15% iltatyö</Text>
            </View>
            <View style={[styles.tableCell, { maxWidth: 50 }]}>
              <Text style={styles.boldText} />
            </View>
            <View style={[styles.tableCell, { alignItems: "flex-start" }]}>
              <Text>Sairastunnit</Text>
            </View>
            <View style={[styles.tableCell, { maxWidth: 50 }]}>
              <Text style={styles.boldText} />
            </View>
            <View style={[styles.tableCell, { alignItems: "flex-start" }]}>
              <Text>Koulutus työajalla</Text>
            </View>
            <View style={[styles.tableCell, { maxWidth: 50 }]}>
              <Text style={styles.boldText} />
            </View>
            <View style={[styles.tableCell, { opacity: 0 }]} />
            <View style={[styles.tableCell, { maxWidth: 50, opacity: 0 }]}>
              <Text />
            </View>
            <View style={[styles.tableCell, { opacity: 0 }]} />
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Raportti tulostettu 12.11.2024 12:54</Text>
        </View>
      </Page>
    </Document>
  );
};

export default WorkingHoursDocument;
