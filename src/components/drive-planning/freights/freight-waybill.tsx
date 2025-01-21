import { Document, Image, Page, Styles, Text, View } from "@react-pdf/renderer";
import logo from "assets/vp-kuljetus-logo.jpeg";
import { Freight, FreightUnit, Site, Task, TaskType } from "generated/client";
import JsBarcode from "jsbarcode";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { LocalizedLabelKey } from "src/types";
import TimeUtils from "src/utils/time-utils";

type WaybillPage = {
  number: number;
  label: LocalizedLabelKey;
};

const WIDE_BORDER = "2px solid #000";
const NARROW_BORDER = "1px solid #000";

const WAYBILL_PAGES: WaybillPage[] = [
  {
    number: 1,
    label: "drivePlanning.freights.print.copies.sender",
  },
  {
    number: 2,
    label: "drivePlanning.freights.print.copies.recipient",
  },
  {
    number: 3,
    label: "drivePlanning.freights.print.copies.driver",
  },
  {
    number: 4,
    label: "drivePlanning.freights.print.copies.carrier",
  },
];

type Props = {
  freight?: Freight;
  sites: Site[];
  tasks: Task[];
  freightUnits: FreightUnit[];
};

const RowView = ({ children, style }: { children?: React.ReactNode; style?: { [key: string]: keyof Styles } }) => (
  <View style={{ display: "flex", flexDirection: "row", ...style }}>{children}</View>
);

const ColumnView = ({ children, style }: { children?: React.ReactNode; style?: { [key: string]: keyof Styles } }) => (
  <View style={{ display: "flex", flexDirection: "column", ...style }}>{children}</View>
);

const LabelText = ({ label, margin }: { label: string; margin?: boolean }) => (
  <Text style={{ margin: margin ? 2 : undefined, fontSize: 5 }}>{label}</Text>
);
const TextValue = ({ value, style }: { value?: string; style?: { [key: string]: keyof Styles } }) => (
  <Text style={{ margin: 1, fontSize: 10, ...style }}>{value}</Text>
);

const FreightWaybill = ({ freight, sites, tasks, freightUnits }: Props) => {
  const { t } = useTranslation();

  const barcodeImageDataUrl = useMemo(() => {
    if (!freight?.freightNumber) return "";
    const canvas = document.createElement("canvas");
    JsBarcode(canvas, freight.freightNumber?.toString() ?? "");
    const dataUrl = canvas.toDataURL();

    canvas.remove();

    return dataUrl;
  }, [freight]);

  const renderSite = useCallback(
    (siteId?: string, inner?: boolean) => {
      const foundSite = sites.find((site) => site.id === siteId);
      if (!foundSite) return null;
      const { name, address, locality, postalCode } = foundSite;
      return (
        <View style={{ paddingTop: inner ? 5 : undefined, paddingLeft: inner ? 10 : undefined }}>
          <Text>{name}</Text>
          <Text>{address}</Text>
          <Text>
            {postalCode} {locality}
          </Text>
        </View>
      );
    },
    [sites],
  );

  const renderTopPart = useCallback(
    ({ label, number }: WaybillPage) => (
      <View>
        <RowView>
          <View style={{ width: "50%" }}>
            <Text>
              <Text style={{ fontWeight: "bold", fontSize: 28 }}>{number}&nbsp;</Text>
              <Text>{t(label)}</Text>
            </Text>
          </View>
          <View style={{ width: "50%", justifyContent: "flex-end" }}>
            <Text style={{ fontWeight: "bold" }}>{t("drivePlanning.freights.print.title")}</Text>
          </View>
        </RowView>
        <RowView>
          <RowView style={{ width: "50%" }}>
            <ColumnView style={{ width: "70%" }}>
              <LabelText label={t("drivePlanning.freights.print.sender")} margin />
              {renderSite(freight?.senderSiteId, false)}
            </ColumnView>
            <ColumnView style={{ width: "30%" }}>
              <ColumnView>
                <LabelText label={t("drivePlanning.freights.print.customerNumber")} margin />
                {/* TODO: Add customer number */}
                <TextValue value=" " />
              </ColumnView>
              <ColumnView>
                <LabelText label={t("drivePlanning.freights.print.contractNumber")} margin />
                {/* TODO: Add contract number */}
                <TextValue value=" " />
              </ColumnView>
              <ColumnView>
                <Text> </Text>
                <Text> </Text>
              </ColumnView>
            </ColumnView>
          </RowView>
          <RowView style={{ width: "50%" }}>
            <ColumnView style={{ width: "50%" }}>
              <ColumnView>
                <LabelText label={t("drivePlanning.freights.print.sendDate")} />
                <TextValue
                  value={TimeUtils.displayAsDate(tasks.find((task) => task.type === TaskType.Load)?.createdAt)}
                />
              </ColumnView>
              <ColumnView>
                <LabelText label={t("drivePlanning.freights.print.senderReference")} />
                {/* TODO: Add Customer number */}
                <TextValue value=" " />
              </ColumnView>
              <ColumnView>
                <LabelText label={t("drivePlanning.freights.print.recipientReference")} />
                {/* TODO: Add Customer number */}
                <TextValue value=" " />
              </ColumnView>
            </ColumnView>
            <ColumnView style={{ width: "50%" }}>
              <ColumnView>
                <LabelText label={t("drivePlanning.freights.print.waybillNumber")} />
                <Text style={{ padding: 1, fontSize: 12, fontWeight: "bold" }}>{freight?.freightNumber}</Text>
              </ColumnView>
            </ColumnView>
          </RowView>
        </RowView>
      </View>
    ),
    [freight, renderSite, tasks, t],
  );

  const renderSiteInfo = useCallback(
    () => (
      <View style={{ borderLeft: WIDE_BORDER }}>
        <RowView>
          <RowView
            style={{
              width: "50%",
              borderBottom: NARROW_BORDER,
              paddingBottom: 20,
            }}
          >
            <ColumnView style={{ width: "70%" }}>
              <LabelText label={t("drivePlanning.freights.print.recipient")} margin />
              {renderSite(freight?.recipientSiteId, true)}
            </ColumnView>
            <ColumnView style={{ width: "30%" }}>
              <ColumnView>
                <LabelText label={t("drivePlanning.freights.print.customerNumber")} margin />
                {/* TODO: Add Customer number */}
                <TextValue value=" " />
              </ColumnView>
              <ColumnView>
                <LabelText label={t("drivePlanning.freights.print.contractNumber")} margin />
                {/* TODO: Add Contract number */}
                <TextValue value=" " />
              </ColumnView>
            </ColumnView>
          </RowView>
          <RowView style={{ width: "50%", padding: 2, borderBottom: NARROW_BORDER, borderLeft: NARROW_BORDER }}>
            <ColumnView>
              <LabelText label={t("drivePlanning.freights.print.freightForwarder")} margin />
              <View style={{ paddingLeft: 10 }}>
                <Image src={logo ? logo : ""} />
              </View>
            </ColumnView>
          </RowView>
        </RowView>
        <RowView style={{ borderBottom: NARROW_BORDER }}>
          <ColumnView style={{ width: "50%" }}>
            <ColumnView style={{ borderBottom: NARROW_BORDER, paddingBottom: 20 }}>
              <LabelText label={t("drivePlanning.freights.print.departurePoint")} margin />
              {renderSite(freight?.pointOfDepartureSiteId, true)}
            </ColumnView>
            <ColumnView style={{ paddingBottom: 20 }}>
              <LabelText label={t("drivePlanning.freights.print.destinationPoint")} margin />
              {renderSite(freight?.destinationSiteId, true)}
            </ColumnView>
          </ColumnView>
          <ColumnView style={{ width: "50%", borderLeft: NARROW_BORDER }}>
            <ColumnView style={{ alignItems: "center", height: "2cm", borderBottom: NARROW_BORDER }}>
              <Image src={barcodeImageDataUrl} />
            </ColumnView>
            <ColumnView style={{ width: "100%" }}>
              <ColumnView style={{ paddingBottom: 30, width: "100%" }}>
                <LabelText label={t("drivePlanning.freights.print.transportInstructions")} margin />
                {/* TODO: Add transport instructions */}
                <Text style={{ fontSize: 10 }}> </Text>
              </ColumnView>
              <RowView style={{ width: "100%" }}>
                <ColumnView style={{ width: "80%" }}>
                  <LabelText label={t("drivePlanning.freights.print.freightPayer")} margin />
                  {/* TODO: Add Freight payer */}
                  <Text> </Text>
                </ColumnView>
                <ColumnView style={{ width: "20%" }}>
                  <ColumnView>
                    <LabelText label={t("drivePlanning.freights.print.customerNumber")} margin />
                    {/* TODO: Add Customer number */}
                    <Text style={{ fontSize: 10, margin: 1, alignSelf: "flex-end" }}> </Text>
                  </ColumnView>
                  <ColumnView>
                    <LabelText label={t("drivePlanning.freights.print.contractNumber")} margin />
                    {/* TODO: Add Contract number */}
                    <Text style={{ fontSize: 10, margin: 1, alignSelf: "flex-end" }}> </Text>
                  </ColumnView>
                </ColumnView>
              </RowView>
            </ColumnView>
          </ColumnView>
        </RowView>
      </View>
    ),
    [renderSite, freight, barcodeImageDataUrl, t],
  );

  const renderFreightUnit = useCallback(
    (freightUnit: FreightUnit) => (
      <RowView key={freightUnit.id}>
        <ColumnView style={{ width: "25%", padding: 2 }}>
          <Text style={{ fontSize: 10 }}> </Text>
        </ColumnView>
        <ColumnView style={{ width: "12%", padding: 2 }}>
          <Text style={{ fontSize: 10 }}>
            {freightUnit.quantity} {freightUnit.type}
          </Text>
        </ColumnView>
        <ColumnView style={{ width: "25%", padding: 2 }}>
          <Text style={{ fontSize: 10 }}>{freightUnit.contents}</Text>
        </ColumnView>
        <ColumnView style={{ width: "12%", padding: 2 }}>
          <Text style={{ fontSize: 10 }}> </Text>
        </ColumnView>
        <ColumnView style={{ width: "12%", padding: 2 }}>
          <Text style={{ fontSize: 10 }}> </Text>
        </ColumnView>
        <ColumnView style={{ width: "12%", padding: 2 }}>
          <Text style={{ fontSize: 10 }}> </Text>
        </ColumnView>
      </RowView>
    ),
    [],
  );

  const renderFreightUnits = useCallback(
    () => (
      <ColumnView style={{ borderBottom: NARROW_BORDER, height: "35%", borderLeft: WIDE_BORDER }}>
        <RowView>
          <ColumnView style={{ width: "25%", borderRight: NARROW_BORDER, padding: 2 }}>
            <LabelText label={t("drivePlanning.freights.print.freightUnits.make.fi")} />
            <LabelText label={t("drivePlanning.freights.print.freightUnits.make.sv")} />
          </ColumnView>
          <ColumnView style={{ width: "12%", borderRight: NARROW_BORDER, padding: 2 }}>
            <LabelText label={t("drivePlanning.freights.print.freightUnits.quantity.fi")} />
            <LabelText label={t("drivePlanning.freights.print.freightUnits.quantity.sv")} />
          </ColumnView>
          <ColumnView style={{ width: "25%", borderRight: NARROW_BORDER, padding: 2 }}>
            <LabelText label={t("drivePlanning.freights.print.freightUnits.content.fi")} />
            <LabelText label={t("drivePlanning.freights.print.freightUnits.content.sv")} />
          </ColumnView>
          <ColumnView style={{ width: "12%", borderRight: NARROW_BORDER, padding: 2 }}>
            <LabelText label={t("drivePlanning.freights.print.freightUnits.code.fi")} />
            <LabelText label={t("drivePlanning.freights.print.freightUnits.code.sv")} />
          </ColumnView>
          <ColumnView style={{ width: "12%", borderRight: NARROW_BORDER, padding: 2 }}>
            <LabelText label={t("drivePlanning.freights.print.freightUnits.grossWeight.fi")} />
          </ColumnView>
          <ColumnView style={{ width: "12%", padding: 2 }}>
            <LabelText label={t("drivePlanning.freights.print.freightUnits.volume.fi")} />
            <LabelText label={t("drivePlanning.freights.print.freightUnits.volume.sv")} />
          </ColumnView>
        </RowView>
        {freightUnits.map(renderFreightUnit)}
      </ColumnView>
    ),
    [freightUnits, renderFreightUnit, t],
  );

  const renderFreightUnitsSummary = useCallback(
    () => (
      <RowView style={{ borderBottom: WIDE_BORDER, borderLeft: WIDE_BORDER }}>
        <ColumnView style={{ width: "25%", borderRight: NARROW_BORDER, padding: 2 }}>
          <LabelText label={t("drivePlanning.freights.print.freightUnits.summary.total.fi")} />
          <LabelText label={t("drivePlanning.freights.print.freightUnits.summary.total.sv")} />
          <Text style={{ fontSize: 10, marginTop: 2, marginLeft: 5 }}> </Text>
        </ColumnView>
        <ColumnView style={{ width: "12%", borderRight: NARROW_BORDER, padding: 2 }}>
          <LabelText label={t("drivePlanning.freights.print.freightUnits.summary.quantity")} />
          <Text style={{ fontSize: 10, marginTop: 2, marginLeft: 5 }}>
            {freightUnits.reduce((acc, freightUnit) => {
              return acc + (freightUnit.quantity ?? 0);
            }, 0)}
          </Text>
        </ColumnView>
        <ColumnView style={{ width: "25%", borderRight: NARROW_BORDER, padding: 2 }}>
          <LabelText label="" />
          <Text style={{ fontSize: 10, marginTop: 2, marginLeft: 5 }}> </Text>
        </ColumnView>
        <ColumnView style={{ width: "12%", borderRight: NARROW_BORDER, padding: 2 }}>
          <LabelText label={t("drivePlanning.freights.print.freightUnits.summary.loadingMeters")} />
          <Text style={{ fontSize: 10, marginTop: 2, marginLeft: 5 }}> </Text>
        </ColumnView>
        <ColumnView style={{ width: "12%", borderRight: NARROW_BORDER, padding: 2 }}>
          <LabelText label={t("drivePlanning.freights.print.freightUnits.summary.grossWeight")} />
          <Text style={{ fontSize: 10, marginTop: 2, marginLeft: 5 }}> </Text>
        </ColumnView>
        <ColumnView style={{ width: "12%", padding: 2 }}>
          <LabelText label={t("drivePlanning.freights.print.freightUnits.summary.freightingWeight")} />
          <Text style={{ fontSize: 10, marginTop: 2, marginLeft: 5 }}> </Text>
        </ColumnView>
      </RowView>
    ),
    [freightUnits, t],
  );

  const renderAdditionalInfo = useCallback(
    () => (
      <RowView style={{ borderBottom: NARROW_BORDER, borderLeft: WIDE_BORDER }}>
        <ColumnView style={{ width: "50%", height: "1.5cm", borderRight: NARROW_BORDER, padding: 2 }}>
          <LabelText label={t("drivePlanning.freights.print.additionalInstructions")} />
          <Text style={{ fontSize: 10 }}> </Text>
        </ColumnView>
        <ColumnView style={{ width: "50%", height: "1.5cm", padding: 2 }}>
          <LabelText label={t("drivePlanning.freights.print.deliveryClause")} />
          <Text style={{ fontSize: 10 }}> </Text>
        </ColumnView>
      </RowView>
    ),
    [t],
  );

  const renderReservations = useCallback(
    () => (
      <RowView style={{ borderLeft: WIDE_BORDER, borderBottom: NARROW_BORDER, padding: 2, height: "1cm" }}>
        <LabelText label={t("drivePlanning.freights.print.reservations")} />
        <Text style={{ fontSize: 10 }}> </Text>
      </RowView>
    ),
    [t],
  );

  const renderEmptyBoxes = useCallback(
    () => (
      <RowView style={{ borderLeft: WIDE_BORDER, borderBottom: WIDE_BORDER }}>
        <ColumnView style={{ width: "12.5%", height: "1cm", borderRight: NARROW_BORDER }} />
        <ColumnView style={{ width: "12.5%", height: "1cm", borderRight: NARROW_BORDER }} />
        <ColumnView style={{ width: "12.5%", height: "1cm", borderRight: NARROW_BORDER }} />
        <ColumnView style={{ width: "12.5%", height: "1cm", borderRight: NARROW_BORDER }} />
        <ColumnView style={{ width: "12.5%", height: "1cm", borderRight: NARROW_BORDER }} />
        <ColumnView style={{ width: "12.5%", height: "1cm", borderRight: NARROW_BORDER }} />
        <ColumnView style={{ width: "12.5%", height: "1cm", borderRight: NARROW_BORDER }} />
        <ColumnView style={{ width: "12.5%", height: "1cm" }} />
      </RowView>
    ),
    [],
  );

  const renderSignatures = useCallback(
    () => (
      <RowView style={{ height: "3cm", borderLeft: WIDE_BORDER }}>
        <ColumnView style={{ width: "37.5%", borderRight: NARROW_BORDER, padding: 2 }}>
          <LabelText label={t("drivePlanning.freights.print.signatures.recipient.fi")} />
          <LabelText label={t("drivePlanning.freights.print.signatures.recipient.sv")} />
        </ColumnView>
        <ColumnView style={{ width: "37.5%", borderRight: NARROW_BORDER, padding: 2, justifyContent: "space-between" }}>
          <ColumnView>
            <LabelText label={t("drivePlanning.freights.print.signatures.driver.fi")} />
            <LabelText label={t("drivePlanning.freights.print.signatures.driver.sv")} />
          </ColumnView>
          <Text style={{ fontSize: 6 }}>{t("drivePlanning.freights.print.signatures.nameClarifications")}</Text>
        </ColumnView>
        <ColumnView style={{ width: "25%", padding: 2 }}>
          <LabelText label={t("drivePlanning.freights.print.signatures.sender.fi")} />
          <LabelText label={t("drivePlanning.freights.print.signatures.sender.sv")} />
        </ColumnView>
      </RowView>
    ),
    [t],
  );

  return (
    <Document>
      {WAYBILL_PAGES.map((waybillPage) => (
        <Page
          key={waybillPage.number}
          size="A4"
          style={{ paddingLeft: "2cm", paddingRight: "1cm", paddingTop: "1cm", fontSize: 12 }}
        >
          {renderTopPart(waybillPage)}
          <ColumnView style={{ borderTop: WIDE_BORDER }}>
            {renderSiteInfo()}
            {renderFreightUnits()}
            {renderFreightUnitsSummary()}
            {renderAdditionalInfo()}
            {renderReservations()}
            {renderEmptyBoxes()}
            {renderSignatures()}
          </ColumnView>
        </Page>
      ))}
    </Document>
  );
};

export default FreightWaybill;
