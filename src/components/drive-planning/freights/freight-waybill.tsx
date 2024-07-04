import { Freight, FreightUnit, Site, Task, TaskType } from "generated/client";
import { Text, Page, Document, Image, View, Styles } from "@react-pdf/renderer";
import { LocalizedLabelKey } from "src/types";
import { useTranslation } from "react-i18next";
import JsBarcode from "jsbarcode";
import { useCallback, useMemo } from "react";
import logo from "assets/vp-kuljetus-logo.jpeg";
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
            <Text style={{ fontWeight: "bold" }}>RAHTIKIRJA FRAKTSEDEL</Text>
          </View>
        </RowView>
        <RowView>
          <RowView style={{ width: "50%" }}>
            <ColumnView style={{ width: "70%" }}>
              <LabelText label="Lähettäjä Avsändare" margin />
              {renderSite(freight?.senderSiteId, false)}
            </ColumnView>
            <ColumnView style={{ width: "30%" }}>
              <ColumnView>
                <LabelText label="Asiakasnro Kundnr" margin />
                {/* TODO: Add customer number */}
                <TextValue value=" " />
              </ColumnView>
              <ColumnView>
                <LabelText label="Sopimusnro Avtalsnr" margin />
                {/* TODO: Add customer number */}
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
                <LabelText label="Lähetyspäivämäärä Avsändningsdatum" />
                <TextValue
                  value={TimeUtils.displayAsDate(tasks.find((task) => task.type === TaskType.Load)?.createdAt)}
                />
              </ColumnView>
              <ColumnView>
                <LabelText label="Lähettäjän viite Avsändarens referens" />
                {/* TODO: Add Customer number */}
                <TextValue value=" " />
              </ColumnView>
              <ColumnView>
                <LabelText label="Vastaanottajan viite Mottagarens referens" />
                {/* TODO: Add Customer number */}
                <TextValue value=" " />
              </ColumnView>
            </ColumnView>
            <ColumnView style={{ width: "50%" }}>
              <ColumnView>
                <LabelText label="Numero Nummer" />
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
              <LabelText label="Vastaanottaja Mottagare" margin />
              {renderSite(freight?.recipientSiteId, true)}
            </ColumnView>
            <ColumnView style={{ width: "30%" }}>
              <ColumnView>
                <LabelText label="Asiakasnro Kundnr" margin />
                {/* TODO: Add Customer number */}
                <TextValue value=" " />
              </ColumnView>
              <ColumnView>
                <LabelText label="Sopimusnro Avtalsnr" margin />
                {/* TODO: Add Customer number */}
                <TextValue value=" " />
              </ColumnView>
            </ColumnView>
          </RowView>
          <RowView style={{ width: "50%", padding: 2, borderBottom: NARROW_BORDER, borderLeft: NARROW_BORDER }}>
            <ColumnView>
              <LabelText label="Rahdinkuljettaja/Huolitsija Transportföretag/Speditör" margin />
              <View style={{ paddingLeft: 10 }}>
                <Image src={logo} />
              </View>
            </ColumnView>
          </RowView>
        </RowView>
        <RowView style={{ borderBottom: NARROW_BORDER }}>
          <ColumnView style={{ width: "50%" }}>
            <ColumnView style={{ borderBottom: NARROW_BORDER, paddingBottom: 20 }}>
              <LabelText
                label="Lähtöpaikka/nouto-osoite Avsändningsort/avhämntningsadress (Lähtöas., raide Avsändningsst., spår)"
                margin
              />
              {renderSite(freight?.pointOfDepartureSiteId, true)}
            </ColumnView>
            <ColumnView style={{ paddingBottom: 20 }}>
              <LabelText
                label="Määräpaikka/toimitusosoite Bestämmelseort/leveransadress (Määräas., raide Bestämmelsest., spår)"
                margin
              />
              {renderSite(freight?.destinationSiteId, true)}
            </ColumnView>
          </ColumnView>
          <ColumnView style={{ width: "50%", borderLeft: NARROW_BORDER }}>
            <ColumnView style={{ alignItems: "center", height: "2cm", borderBottom: NARROW_BORDER }}>
              <Image src={barcodeImageDataUrl} />
            </ColumnView>
            <ColumnView style={{ width: "100%" }}>
              <ColumnView style={{ paddingBottom: 30, width: "100%" }}>
                <LabelText label="Kuljetusohjeet Transportinstruktioner" margin />
                {/* TODO: Add transport instructions */}
                <Text style={{ fontSize: 10 }}> </Text>
              </ColumnView>
              <RowView style={{ width: "100%" }}>
                <ColumnView style={{ width: "80%" }}>
                  <LabelText label="Rahdinmaksaja Fraktbetalare" margin />
                  {renderSite(freight?.senderSiteId, true)}
                </ColumnView>
                <ColumnView style={{ width: "20%" }}>
                  <ColumnView>
                    <LabelText label="Asiakasnro Kundnr" margin />
                    {/* TODO: Add Customer number */}
                    <Text style={{ fontSize: 10, margin: 1, alignSelf: "flex-end" }}> </Text>
                  </ColumnView>
                  <ColumnView>
                    <LabelText label="Sopimusnro Avtalsnr" margin />
                    {/* TODO: Add Customer number */}
                    <Text style={{ fontSize: 10, margin: 1, alignSelf: "flex-end" }}> </Text>
                  </ColumnView>
                </ColumnView>
              </RowView>
            </ColumnView>
          </ColumnView>
        </RowView>
      </View>
    ),
    [renderSite, freight, barcodeImageDataUrl],
  );

  const renderFreightUnit = useCallback(
    (freightUnit: FreightUnit) => (
      <RowView>
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
            <LabelText label="Merkki / nro" />
            <LabelText label="Märke / nr" />
          </ColumnView>
          <ColumnView style={{ width: "12%", borderRight: NARROW_BORDER, padding: 2 }}>
            <LabelText label="Kolliluku ja -laji" />
            <LabelText label="Kolliantal och -slag" />
          </ColumnView>
          <ColumnView style={{ width: "25%", borderRight: NARROW_BORDER, padding: 2 }}>
            <LabelText label="Sisältö, ulkomitat ja VAK-tiedot" />
            <LabelText label="Innehål, yttermåt och ADR-information" />
          </ColumnView>
          <ColumnView style={{ width: "12%", borderRight: NARROW_BORDER, padding: 2 }}>
            <LabelText label="(Koodi)" />
            <LabelText label="(Kod)" />
          </ColumnView>
          <ColumnView style={{ width: "12%", borderRight: NARROW_BORDER, padding: 2 }}>
            <LabelText label="Brutto, kg" />
          </ColumnView>
          <ColumnView style={{ width: "12%", padding: 2 }}>
            <LabelText label="Tilavuus, m3" />
            <LabelText label="Volym" />
          </ColumnView>
        </RowView>
        {freightUnits.map(renderFreightUnit)}
      </ColumnView>
    ),
    [freightUnits, renderFreightUnit],
  );

  const renderFreightUnitsSummary = useCallback(
    () => (
      <RowView style={{ borderBottom: WIDE_BORDER, borderLeft: WIDE_BORDER }}>
        <ColumnView style={{ width: "25%", borderRight: NARROW_BORDER, padding: 2 }}>
          <LabelText label="Lähetyksen tiedot yhteensä" />
          <LabelText label="Sändningsinformation, totalt" />
          <Text style={{ fontSize: 10, marginTop: 2, marginLeft: 5 }}> </Text>
        </ColumnView>
        <ColumnView style={{ width: "12%", borderRight: NARROW_BORDER, padding: 2 }}>
          <LabelText label="Kollit kolliantal" />
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
          <LabelText label="Lavametrit Flakmeter" />
          <Text style={{ fontSize: 10, marginTop: 2, marginLeft: 5 }}> </Text>
        </ColumnView>
        <ColumnView style={{ width: "12%", borderRight: NARROW_BORDER, padding: 2 }}>
          <LabelText label="Brutto, kg" />
          <Text style={{ fontSize: 10, marginTop: 2, marginLeft: 5 }}> </Text>
        </ColumnView>
        <ColumnView style={{ width: "12%", padding: 2 }}>
          <LabelText label="Rahdituspaino, Fraktvikt" />
          <Text style={{ fontSize: 10, marginTop: 2, marginLeft: 5 }}> </Text>
        </ColumnView>
      </RowView>
    ),
    [freightUnits],
  );

  const renderAdditionalInfo = useCallback(
    () => (
      <RowView style={{ borderBottom: NARROW_BORDER, borderLeft: WIDE_BORDER }}>
        <ColumnView style={{ width: "50%", height: "1.5cm", borderRight: NARROW_BORDER, padding: 2 }}>
          <LabelText label="Lisäohjeet Tillägginstruktioner" />
          <Text style={{ fontSize: 10 }}> </Text>
        </ColumnView>
        <ColumnView style={{ width: "50%", height: "1.5cm", padding: 2 }}>
          <LabelText label="Muut tiedot /toimituslauseke Tilläggsuppgifter /leveransklausul" />
          <Text style={{ fontSize: 10 }}> </Text>
        </ColumnView>
      </RowView>
    ),
    [],
  );

  const renderReservations = useCallback(
    () => (
      <RowView style={{ borderLeft: WIDE_BORDER, borderBottom: NARROW_BORDER, padding: 2, height: "1cm" }}>
        <LabelText label="Varaumat, pvm, aika, paikka ja kuittaus Förbehåll, datum, tid och kvittering" />
        <Text style={{ fontSize: 10 }}> </Text>
      </RowView>
    ),
    [],
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
          <LabelText label="Vastaanottaja, pvm, aika ja allekirjoitus" />
          <LabelText label="Mottagare, datum, tid och underskrift" />
        </ColumnView>
        <ColumnView style={{ width: "37.5%", borderRight: NARROW_BORDER, padding: 2, justifyContent: "space-between" }}>
          <ColumnView>
            <LabelText label="Otettu kuljetettavaksi, kuljettaja, pvm, aika ja allekirjoitus" />
            <LabelText label="Mottaget för transport, chaufför, datum, tid och underskrift" />
          </ColumnView>
          <Text style={{ fontSize: 6 }}>Nimenselvennykset Namnförtydliganden</Text>
        </ColumnView>
        <ColumnView style={{ width: "25%", padding: 2 }}>
          <LabelText label="Lähettäjä, pvm, aika ja allekirjoitus" />
          <LabelText label="Avsändare, datum, tid och underskrift" />
        </ColumnView>
      </RowView>
    ),
    [],
  );

  return (
    <Document>
      {WAYBILL_PAGES.map((waybillPage) => (
        <Page size="A4" style={{ paddingLeft: "2cm", paddingRight: "1cm", paddingTop: "1cm", fontSize: 12 }}>
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
