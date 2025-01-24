import { Close, SaveAlt } from "@mui/icons-material";
import { Box, Button, Paper, Stack } from "@mui/material";
import { UseMutationResult } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import config from "app/config";
import LoaderWrapper from "components/generic/loader-wrapper";
import ToolbarRow from "components/generic/toolbar-row";
import { Site, SiteType } from "generated/client";
import { Map as LeafletMap, latLng } from "leaflet";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import LocationUtils from "utils/location-utils";
import TerminalForm from "./terminal-form";

type Props = {
  formType: "ADD" | "MODIFY";
  site?: Site;
  onSave: UseMutationResult<Site, Error, Site, unknown>;
};

const DEFAULT_MAP_CENTER = latLng(61.1621924, 28.65865865);

function TerminalSiteComponent({ formType, site, onSave }: Props) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    mapbox: { baseUrl, publicApiKey },
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
    defaultValues: site,
    shouldFocusError: true,
  });

  const markerPosition = watch("location") ? LocationUtils.wellKnownPointToLatLng(watch("location")) : undefined;

  useEffect(() => {
    if (mapRef.current && markerPosition) {
      mapRef.current.setView(latLng(markerPosition));
    }
  }, [markerPosition]);

  const isSaveDisabled = (errors && !markerPosition) || !isDirty;

  const onTerminalSave = async (site: Site) => {
    await onSave.mutateAsync({ ...site, siteType: SiteType.Terminal, deviceIds: [] });
    navigate({ to: "/management/terminals" });
  };

  const renderToolbarButtons = () => (
    <Stack direction="row" spacing={1}>
      {isDirty && (
        <Button variant="text" startIcon={<Close />} onClick={() => reset(site)}>
          {t("cancel")}
        </Button>
      )}
      <Button
        variant="contained"
        startIcon={<SaveAlt />}
        disabled={isSaveDisabled}
        onClick={handleSubmit(onTerminalSave)}
      >
        {t("save")}
      </Button>
    </Stack>
  );

  return (
    <LoaderWrapper loading={onSave.isPending}>
      <Paper sx={{ height: "100%" }}>
        <ToolbarRow
          title={
            formType === "ADD" ? t("management.terminals.new") : t("management.terminals.modify", { name: site?.name })
          }
          navigateBack={() => navigate({ to: "/management/terminals" })}
          toolbarButtons={renderToolbarButtons()}
        />
        <Stack direction="row" height="calc(100% - 52px)">
          <TerminalForm errors={errors} terminal={site} register={register} setFormValue={setValue} watch={watch} />
          <Box flex={1} alignContent="center" justifyContent="center">
            <MapContainer ref={mapRef} style={{ height: "100%" }} center={DEFAULT_MAP_CENTER} zoom={13}>
              <TileLayer
                attribution='<a href="https://www.mapbox.com/about/maps/">© Mapbox</a> <a href="https://www.openstreetmap.org/copyright">© OpenStreetMap</a> <a href="https://www.mapbox.com/map-feedback/">Improve this map</a>'
                url={`${baseUrl}/styles/v1/metatavu/clsszigf302jx01qy0e4q0c7e/tiles/{z}/{x}/{y}?access_token=${publicApiKey}`}
              />
              {markerPosition && <Marker position={markerPosition} />}
            </MapContainer>
          </Box>
        </Stack>
      </Paper>
    </LoaderWrapper>
  );
}

export default TerminalSiteComponent;
