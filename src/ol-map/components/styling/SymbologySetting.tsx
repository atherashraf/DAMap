import * as React from "react";
import { Box, Button } from "@mui/material";
import MapVM from "../../models/MapVM";
import VectorStyling from "./VectorStyling";
import RasterStyling from "./RasterStyling";
import MapApi, { MapAPIs } from "../../utils/MapApi";

export interface SymbologySettingProps {
  mapVM: MapVM;
}

const SymbologySetting = (props: SymbologySettingProps) => {
  const layerId = props.mapVM.getLayerOfInterest();
  const daLayer = props.mapVM.getDALayer(layerId);
  const handleDownloadStyle = () => {
    const uuid = props.mapVM.getLayerOfInterest();
    const url = MapApi.getURL(MapAPIs.DCH_DOWNLOAD_DA_STYLE, { uuid: uuid });
    window.open(url);
  };
  return (
    <Box sx={{ width: "100%", boxSizing: "border-box", p: 1 }}>
      {daLayer?.layerInfo?.dataModel === "V" ? (
        <VectorStyling mapVM={props.mapVM} />
      ) : (
        <RasterStyling mapVM={props.mapVM} />
      )}
      <Button
        fullWidth={true}
        color={"primary"}
        variant={"contained"}
        onClick={handleDownloadStyle}
      >
        Download Style
      </Button>
    </Box>
  );
};

export default SymbologySetting;
