// @ts-nocheck
import { Freight, Site, Task, TaskType } from "generated/client";
import { Text, Page, Document, Image, View, Styles } from "@react-pdf/renderer";
import { LocalizedLabelKey } from "src/types";
import { useTranslation } from "react-i18next";
import JsBarcode from "jsbarcode";
import { useCallback, useMemo } from "react";
import logo from "assets/vp-kuljetus-logo.jpeg";

type WaybillPage = {
  number: number;
  label: LocalizedLabelKey;
};

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
};

const RowView = ({ children, style }: { children: React.ReactNode; style?: Styles }) => (
  <View style={{ display: "flex", flexDirection: "row", ...style }}>{children}</View>
);

const ColumnView = ({ children, style }: { children: React.ReactNode; style?: Styles }) => (
  <View style={{ display: "flex", flexDirection: "column", ...style }}>{children}</View>
);

const FreightWaybill = ({ freight, sites, tasks }: Props) => {
  const { t } = useTranslation();

  const barcodeImageDataUrl = useMemo(() => {
    if (!freight?.freightNumber) return "";
    const canvas = document.createElement("canvas");
    JsBarcode(canvas, freight.freightNumber.toString() ?? "", { fontSize: 15 });
    const dataUrl = canvas.toDataURL();

    canvas.remove();

    return dataUrl;
  }, [freight]);

  const { freightNumber } = freight ?? {};

  const renderSite = useCallback(
    (siteId: string, inner: boolean) => {
      const foundSite = sites.find((site) => site.id === siteId);
      if (!foundSite) return null;
      const { name, address, locality, postalCode } = foundSite;
      return (
        <View style={{ paddingTop: 5, paddingLeft: inner ? 10 : undefined }}>
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
              <Text style={{ fontWeight: "bold", fontSize: 28 }}>{number}&nbsp;&nbsp;</Text>
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
              <Text style={{ fontSize: 5 }}>Lähettäjä Avsändare</Text>
              {renderSite(freight?.senderSiteId)}
            </ColumnView>
            <ColumnView style={{ width: "30%" }}>
              <ColumnView>
                <Text style={{ fontSize: 5 }}>Asiakasnro Kundnr</Text>
                <Text style={{ padding: 1, fontSize: 10 }}>0123</Text>
              </ColumnView>
              <ColumnView>
                <Text style={{ fontSize: 5 }}>Sopimusnro Avtalsnr</Text>
                <Text style={{ padding: 1, fontSize: 10 }}>4567</Text>
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
                <Text style={{ fontSize: 5 }}>Lähetyspäivämäärä Avsändningsdatum</Text>
                <Text style={{ padding: 1, fontSize: 10 }}>
                  {tasks.find((task) => task.type === TaskType.Load)?.createdAt?.toLocaleDateString()}
                </Text>
              </ColumnView>
              <ColumnView>
                <Text style={{ fontSize: 5 }}>Lähettäjän viite Avsändarens referens</Text>
                <Text style={{ padding: 1, fontSize: 10 }}>0123</Text>
              </ColumnView>
              <ColumnView>
                <Text style={{ fontSize: 5 }}>Vastaanottajan viite Mottagarens referens</Text>
                <Text style={{ padding: 1, fontSize: 10 }}>4567</Text>
              </ColumnView>
            </ColumnView>
            <ColumnView style={{ width: "50%" }}>
              <ColumnView>
                <Text style={{ fontSize: 5 }}>Numero Nummer</Text>
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
      <View>
        <RowView
          style={{
            borderTop: "2px solid #000",
            borderLeft: "2px solid #000",
          }}
        >
          <RowView
            style={{
              width: "50%",
              borderRight: "1px solid #000",
              borderBottom: "1px solid #000",
              padding: 2,
              paddingBottom: 20,
            }}
          >
            <ColumnView style={{ width: "70%" }}>
              <Text style={{ fontSize: 5 }}>Vastaanottaja Mottagare</Text>
              {renderSite(freight?.recipientSiteId, true)}
            </ColumnView>
            <ColumnView style={{ width: "30%" }}>
              <ColumnView>
                <Text style={{ fontSize: 5 }}>Asiakasnro Kundnr</Text>
                <Text style={{ fontSize: 10 }}>0123</Text>
              </ColumnView>
              <ColumnView>
                <Text style={{ fontSize: 5 }}>Sopimusnro Avtalsnr</Text>
                <Text style={{ fontSize: 10 }}>4567</Text>
              </ColumnView>
            </ColumnView>
          </RowView>
          <RowView style={{ width: "50%", padding: 2, borderBottom: "1px solid #000" }}>
            <ColumnView>
              <Text style={{ fontSize: 5 }}>Rahdinkuljettaja/Huolitsija Transportföretag/Speditör</Text>
              <View style={{ paddingLeft: 10 }}>
                <Image src={logo} />
              </View>
            </ColumnView>
          </RowView>
        </RowView>
        <RowView style={{ borderLeft: "2px solid #000", borderBottom: "1px solid #000" }}>
          <ColumnView style={{ width: "50%" }}>
            <ColumnView
              style={{ borderBottom: "1px solid #000", borderRight: "1px solid #000", padding: 2, paddingBottom: 20 }}
            >
              <Text style={{ fontSize: 5 }}>
                Lähtöpaikka/nouto-osoite Avsändningsort/avhämntningsadress (Lähtöas., raide Avsändningsst., spår)
              </Text>
              {renderSite(freight?.pointOfDepartureSiteId, true)}
            </ColumnView>
            <ColumnView style={{ padding: 2, paddingBottom: 20 }}>
              <Text style={{ fontSize: 5 }}>
                Määräpaikka/toimitusosoite Bestämmelseort/leveransadress (Määräas., raide Bestämmelsest., spår)
              </Text>
              {renderSite(freight?.destinationSiteId, true)}
            </ColumnView>
          </ColumnView>
          <ColumnView style={{ width: "50%" }}>
            <ColumnView style={{ alignItems: "center", height: "2cm", borderBottom: "1px solid #000" }}>
              <Image src={barcodeImageDataUrl} style={{ width: "75%" }} />
            </ColumnView>
            <ColumnView style={{ width: "100%", borderLeft: "1px solid #000" }}>
              <ColumnView style={{ padding: 2, paddingBottom: 30, width: "100%" }}>
                <Text style={{ fontSize: 5 }}>Kuljetusohjeet Transportinstruktioner</Text>
                <Text style={{ fontSize: 10 }}>+2 TOIMITUS</Text>
              </ColumnView>
              <RowView style={{ width: "100%" }}>
                <ColumnView style={{ width: "70%" }}>
                  <Text style={{ fontSize: 5 }}>Rahdinmaksaja Fraktbetalare</Text>
                  {renderSite(freight?.senderSiteId, true)}
                </ColumnView>
                <ColumnView style={{ width: "30%" }}>
                  <ColumnView>
                    <Text style={{ fontSize: 5 }}>Asiakasnro Kundnr</Text>
                    <Text style={{ fontSize: 10, alignSelf: "flex-end" }}>2430</Text>
                  </ColumnView>
                  <ColumnView>
                    <Text style={{ fontSize: 5 }}>Sopimusnro Avtalsnr</Text>
                    <Text style={{ fontSize: 10, alignSelf: "flex-end" }}>2430</Text>
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

  return (
    <Document>
      {WAYBILL_PAGES.map((waybillPage) => (
        <Page size="A4" style={{ paddingLeft: "2cm", paddingRight: "1cm", fontSize: 12 }}>
          {renderTopPart(waybillPage)}
          {renderSiteInfo()}
        </Page>
      ))}
    </Document>
  );
};

export default FreightWaybill;
