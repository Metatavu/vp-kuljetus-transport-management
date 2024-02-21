import { Box, Button, Paper, Stack } from "@mui/material";
import { useNavigate } from "@tanstack/react-router";
import ToolbarRow from "components/generic/toolbar-row";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import CustomerSiteForm from "./customer-site-form";
import { Close, SaveAlt } from "@mui/icons-material";
import { Site } from "generated/client";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import { useEffect, useRef } from "react";
import { Map as LeafletMap, latLng } from "leaflet";
import { GeoJSONPoint, parse } from "wellknown";
import { UseMutationResult } from "@tanstack/react-query";
import LoaderWrapper from "components/generic/loader-wrapper";
import config from "../../app/config";

type Props = {
  formType: "ADD" | "MODIFY";
  initialData?: Site;
  onSave: UseMutationResult<Site, Error, Site, unknown>;
};

const DEFAULT_MAP_CENTER = latLng(61.1621924, 28.65865865);

function CustomerSiteComponent({ formType, initialData, onSave }: Props) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    mapbox: { publicApiKey },
  } = config;

  const mapRef = useRef<LeafletMap>(null);

  const {
    setValue,
    handleSubmit,
    register,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm<Site>({
    mode: "onChange",
    defaultValues: initialData,
    shouldFocusError: true,
  });

  const markerPosition = watch("location") ? parse(watch("location")) : undefined;

  useEffect(() => {
    if (mapRef.current && markerPosition) {
      const location = (markerPosition as GeoJSONPoint).coordinates;
      mapRef.current.setView(latLng(location));
    }
  }, [markerPosition]);

  const isSaveDisabled = (errors && !markerPosition) || !isDirty;

  const onCustomerSiteSave = async (site: Site) => onSave.mutate(site);

  const renderToolbarButtons = () => (
    <Stack direction="row" spacing={1}>
      {isDirty && (
        <Button variant="text" startIcon={<Close />} onClick={() => reset(initialData)}>
          {t("cancel")}
        </Button>
      )}
      <Button
        variant="contained"
        startIcon={<SaveAlt />}
        disabled={isSaveDisabled}
        onClick={handleSubmit(onCustomerSiteSave)}
      >
        {t("save")}
      </Button>
    </Stack>
  );

  const geoJsonPointToLatLng = ({ coordinates }: GeoJSONPoint) => {
    return latLng(coordinates);
  };

  return (
    <LoaderWrapper loading={onSave.isPending}>
      <Paper sx={{ height: "100%" }}>
        <ToolbarRow
          title={formType === "ADD" ? t("management.customerSites.new") : t("management.customerSites.modify")}
          navigateBack={() => navigate({ to: "/management/customer-sites" })}
          toolbarButtons={renderToolbarButtons()}
        />
        <Stack direction="row" height="calc(100% - 52px)">
          <CustomerSiteForm
            errors={errors}
            customerSite={initialData}
            register={register}
            setFormValue={setValue}
            watch={watch}
          />
          <Box flex={1} alignContent="center" justifyContent="center">
            <MapContainer ref={mapRef} style={{ height: "100%" }} center={DEFAULT_MAP_CENTER} zoom={13}>
              <TileLayer
                attribution='<a href="https://www.mapbox.com/about/maps/">© Mapbox</a> <a href="https://www.openstreetmap.org/copyright">© OpenStreetMap</a> <a href="https://www.mapbox.com/map-feedback/">Improve this map</a>'
                url={`https://api.mapbox.com/styles/v1/metatavu/clsszigf302jx01qy0e4q0c7e/tiles/{z}/{x}/{y}@2x?access_token=${publicApiKey}`}
              />
              {markerPosition && <Marker position={geoJsonPointToLatLng(markerPosition as GeoJSONPoint)} />}
            </MapContainer>
          </Box>
        </Stack>
      </Paper>
    </LoaderWrapper>
  );
}

export default CustomerSiteComponent;
