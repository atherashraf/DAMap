import * as React from "react";
import {Box} from "@mui/material";
import MapVM from "../../models/MapVM";
import VectorStyling from "./VectorStyling";
import RasterStyling from "./RasterStyling";


export interface SymbologySettingProps {
    mapVM: MapVM
}

const SymbologySetting = (props: SymbologySettingProps) => {
    const layerId = props.mapVM.getLayerOfInterest()
    const daLayer = props.mapVM.getDALayer(layerId)
    return (
        <Box sx={{width: "100%", boxSizing: "border-box", p: 1}}>
            {daLayer?.layerInfo?.dataModel == 'V' ?
                <VectorStyling mapVM={props.mapVM}/> : <RasterStyling  mapVM={props.mapVM} />}
        </Box>
    )
}

export default SymbologySetting
