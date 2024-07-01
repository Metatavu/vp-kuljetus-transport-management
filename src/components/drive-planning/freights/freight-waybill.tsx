import { Freight } from "generated/client";
import { Text, Page, Document, Image, View } from "@react-pdf/renderer";
import { LocalizedLabelKey } from "src/types";
import { useTranslation } from "react-i18next";
import JsBarcode from "jsbarcode";
import { useMemo } from "react";

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
};

const FreightWaybill = ({ freight }: Props) => {
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

  if (!freightNumber) return null;

  return (
    <Document>
      {WAYBILL_PAGES.map(({ number, label }) => (
        <Page size="A4" style={{ marginLeft: "2cm", fontSize: 12, width: "100%" }}>
          <View style={{ display: "flex", flexDirection: "row" }}>
            <View style={{ width: "50%" }}>
              <Text>
                <Text style={{ fontWeight: "bold", fontSize: 28 }}>{number}&nbsp;&nbsp;</Text>
                <Text>{t(label)}</Text>
              </Text>
            </View>
            <View style={{ fontWeight: "bold", width: "50%" }}>
              <Text>RAHTIKIRJA FRAKTSEDEL</Text>
            </View>
          </View>
          <View style={{ display: "flex", flexDirection: "row", width: "50%" }}>
            <View style={{ display: "flex", flexDirection: "column", width: "50%" }}>
              <Text style={{ fontSize: 8 }}>Lähettäjä Avsändare</Text>
              <Text>VP-Kuljetus Oy Kouvola</Text>
              <Text>Tykkimäentie 9</Text>
            </View>
            <View style={{ display: "flex", flexDirection: "column", width: "50%" }}>
              <View style={{ display: "flex", flexDirection: "column" }}>
                <Text style={{ fontSize: 8 }}>Asiakasnro Kundnr</Text>
                <Text> </Text>
                <Text> </Text>
              </View>
              <View style={{ display: "flex", flexDirection: "column" }}>
                <Text style={{ fontSize: 8 }}>Sopimusnro Avtalsnr</Text>
                <Text> </Text>
                <Text> </Text>
              </View>
            </View>
          </View>
          <View style={{ display: "flex", flexDirection: "row", width: "50%" }}>
            <View style={{ display: "flex", flexDirection: "column", width: "50%" }}>
              <View style={{ display: "flex", flexDirection: "column" }}>
                <Text style={{ fontSize: 8 }}>Lähetyspäivämäärä Avsändningsdatum</Text>
                <Text>1.7.2024</Text>
              </View>
              <View style={{ display: "flex", flexDirection: "column" }}>
                <Text style={{ fontSize: 8 }}>Lähettäjän viite Avsändarens referens</Text>
                <Text> </Text>
              </View>
              <View style={{ display: "flex", flexDirection: "column" }}>
                <Text style={{ fontSize: 8 }}>Vastaanottajan viite Mottagarens referens</Text>
                <Text> </Text>
              </View>
            </View>
            <View style={{ display: "flex", flexDirection: "column", width: "50%" }}>
              <Text style={{ fontSize: 8 }}>Numero nummer</Text>
              <Text>{freightNumber}</Text>
            </View>
          </View>
          <Text>{t("drivePlanning.freights.print.waybill", { freightNumber: freightNumber })}</Text>
          <Image src={barcodeImageDataUrl} style={{ width: "25%", height: "10%" }} />
        </Page>
      ))}
    </Document>
  );
};

export default FreightWaybill;
