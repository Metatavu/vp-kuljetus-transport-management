import { Restore, SaveAlt } from "@mui/icons-material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Button, Paper, Stack, Tab } from "@mui/material";
import { UseMutationResult, useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { api } from "api/index";
import config from "app/config";
import LoaderWrapper from "components/generic/loader-wrapper";
import ToolbarRow from "components/generic/toolbar-row";
import { useConfirmDialog } from "components/providers/confirm-dialog-provider";
import { Site, SiteType } from "generated/client";
import { QUERY_KEYS } from "hooks/use-queries";
import { Map as LeafletMap, latLng } from "leaflet";
import { SyntheticEvent, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import { queryClient } from "src/main";
import LocationUtils from "utils/location-utils";
import TerminalForm from "./terminal-form";
import Thermometers from "./thermometers";

type Props = {
  formType: "ADD" | "MODIFY";
  site?: Site;
  onUpdate?: UseMutationResult<
    void,
    Error,
    {
      site: Site;
      originalSite: Site;
      changedThermometers: {
        newName: string;
        thermometerId: string;
      }[];
    },
    unknown
  >;
  onSave?: UseMutationResult<Site, Error, Site, unknown>;
};

const DEFAULT_MAP_CENTER = latLng(61.1621924, 28.65865865);

function TerminalSiteComponent({ formType, site, onSave, onUpdate }: Props) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState("1");
  const formState = useMemo(() => formType, [formType]);
  const thermometersRef = useRef<{ reset: () => void } | null>(null);
  const handleTabChange = (_event: SyntheticEvent, newTabValue: string) => {
    setTabValue(newTabValue);
  };
  const [changedTerminalThermometerNames, setChangedTerminalThermometerNames] = useState<
    { newName: string; thermometerId: string }[]
  >([]);

  const {
    mapbox: { baseUrl, publicApiKey },
  } = config;
  const showConfirmDialog = useConfirmDialog();

  const mapRef = useRef<LeafletMap>(null);

  const {
    setValue,
    handleSubmit,
    register,
    reset,
    watch,
    formState: { errors, dirtyFields },
  } = useForm<Site>({
    mode: "onChange",
    defaultValues: site,
    shouldFocusError: true,
  });

  const markerPosition = watch("location")
    ? LocationUtils.wellKnownPointToLatLng(watch("location"))
    : DEFAULT_MAP_CENTER;

  useEffect(() => {
    if (mapRef.current && markerPosition) {
      mapRef.current.setView(latLng(markerPosition));
    }
  }, [markerPosition]);

  const isSaveDisabled =
    Object.keys(dirtyFields).length < 1 || Object.keys(errors).length > 0 || onSave?.isPending || onUpdate?.isPending;

  const isUndoChangesDisabled = Object.keys(dirtyFields).length < 1 || onSave?.isPending || onUpdate?.isPending;

  const onTerminalSave = async (siteData: Site) => {
    if (formState === "ADD") {
      const newSite = await onSave?.mutateAsync({ ...siteData, siteType: SiteType.Terminal, deviceIds: [] });
      newSite && navigate({ to: `/management/terminals/${newSite.id}/modify` });
    } else {
      if (!site) return;
      onUpdate?.mutate({
        site: siteData,
        originalSite: site,
        changedThermometers: changedTerminalThermometerNames,
      });
    }
  };

  const archiveTerminal = useMutation({
    mutationKey: ["archiveSite", watch("id")],
    mutationFn: (site?: Site) => {
      if (!site?.id) return Promise.reject();
      return api.sites.updateSite({ siteId: site.id, site: { ...site, archivedAt: new Date() } });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SITES] });
      navigate({ to: "/management/terminals" });
    },
  });

  const handleReset = () => {
    reset({
      ...site,
      name: site?.name ?? "",
      address: site?.address ?? "",
      postalCode: site?.postalCode ?? "",
      locality: site?.locality ?? "",
      additionalInfo: site?.additionalInfo ?? "",
      location: site?.location ?? "",
    });
    thermometersRef.current?.reset();
  };

  const renderToolbarButtons = () => (
    <Stack direction="row" spacing={1}>
      {site && (
        <Button
          variant="outlined"
          onClick={() =>
            showConfirmDialog({
              title: t("management.terminals.archiveDialog.title"),
              description: t("management.terminals.archiveDialog.description", { name: watch("name") }),
              positiveButtonText: t("archive"),
              onPositiveClick: () => archiveTerminal.mutate(site),
            })
          }
        >
          {t("archive")}
        </Button>
      )}
      <Button
        title={t("undoFormChangesTitle")}
        disabled={isUndoChangesDisabled && changedTerminalThermometerNames.length < 1}
        variant="text"
        startIcon={<Restore />}
        onClick={() => handleReset()}
      >
        {t("undoChanges")}
      </Button>
      <Button
        variant="contained"
        startIcon={<SaveAlt />}
        disabled={isSaveDisabled && changedTerminalThermometerNames.length < 1}
        onClick={handleSubmit(onTerminalSave)}
      >
        {t("save")}
      </Button>
    </Stack>
  );

  return (
    <LoaderWrapper loading={(onSave?.isPending || onUpdate?.isPending) ?? false}>
      <Paper sx={{ height: "100%" }}>
        <ToolbarRow
          title={
            formState === "ADD" ? t("management.terminals.new") : t("management.terminals.modify", { name: site?.name })
          }
          navigateBack={() => navigate({ to: "/management/terminals" })}
          toolbarButtons={renderToolbarButtons()}
        />
        <Stack direction="row" height="calc(100% - 52px)">
          <TerminalForm errors={errors} terminal={site} register={register} setFormValue={setValue} watch={watch} />
          <Stack flex={1} bgcolor={"background.default"}>
            <TabContext value={tabValue}>
              <TabList onChange={handleTabChange} aria-label="tabs" sx={{ backgroundColor: "background.paper" }}>
                <Tab label={t("management.terminals.devices")} value="1" />
                <Tab label={t("management.terminals.map")} value="2" />
              </TabList>
              <TabPanel value="1" sx={{ flex: 1 }}>
                {site && (
                  <Thermometers
                    site={site}
                    setChangedTerminalThermometerNames={setChangedTerminalThermometerNames}
                    ref={thermometersRef}
                  />
                )}
              </TabPanel>
              <TabPanel value="2" sx={{ flex: 1 }}>
                <MapContainer ref={mapRef} style={{ height: "100%" }} center={markerPosition} zoom={13}>
                  <TileLayer
                    attribution='<a href="https://www.mapbox.com/about/maps/">© Mapbox</a> <a href="https://www.openstreetmap.org/copyright">© OpenStreetMap</a> <a href="https://www.mapbox.com/map-feedback/">Improve this map</a>'
                    url={`${baseUrl}/styles/v1/metatavu/clsszigf302jx01qy0e4q0c7e/tiles/{z}/{x}/{y}?access_token=${publicApiKey}`}
                  />
                  {markerPosition && <Marker position={markerPosition} />}
                </MapContainer>
              </TabPanel>
            </TabContext>
          </Stack>
        </Stack>
      </Paper>
    </LoaderWrapper>
  );
}

export default TerminalSiteComponent;
