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

type Props = {
  formType: "ADD" | "MODIFY";
  initialData?: Site;
  onSave: UseMutationResult<Site, Error, Site, unknown>;
};

const DEFAULT_MAP_CENTER = latLng(61.1621924, 28.65865865);

function CustomerSiteComponent({ formType, initialData, onSave }: Props) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const mapRef = useRef<LeafletMap>(null);

  const {
    setValue,
    handleSubmit,
    register,
    watch,
    formState: { errors },
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

  const isSaveDisabled = errors && !markerPosition;

  const onCustomerSiteSave = async (site: Site) => {
    onSave.mutate(site);
  };

  const renderToolbarButtons = () => (
    <Stack direction="row" spacing={1}>
      <Button variant="text" startIcon={<Close />} onClick={() => navigate({ to: "/management/customer-sites" })}>
        {t("cancel")}
      </Button>
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
        <Stack direction="row" sx={{ minHeight: "calc(100% - 32px)", maxHeight: "calc(100% - 32px" }} overflow="hidden">
          <CustomerSiteForm errors={errors} register={register} setFormValue={setValue} watch={watch} />
          <Box flex={1} alignContent="center" justifyContent="center">
            <MapContainer
              ref={mapRef}
              style={{ height: "calc(100% - 20px)", maxHeight: "100%" }}
              center={DEFAULT_MAP_CENTER}
              zoom={13}
            >
              <TileLayer
                attribution='<a href="https://www.mapbox.com/about/maps/">© Mapbox</a> <a href="https://www.openstreetmap.org/copyright">© OpenStreetMap</a> <a href="https://www.mapbox.com/map-feedback/">Improve this map</a>'
                url="https://api.mapbox.com/styles/v1/metatavu/clsszigf302jx01qy0e4q0c7e/tiles/{z}/{x}/{y}@2x?access_token=sk.eyJ1IjoibWV0YXRhdnUiLCJhIjoiY2xzc3l1eDduMGxsbjJubWxybDl6azkzeCJ9.N1vZquK1S5vi5lVYpnypTA"
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
