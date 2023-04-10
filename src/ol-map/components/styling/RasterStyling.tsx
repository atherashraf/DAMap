import MapVM from "../../models/MapVM";
import * as React from "react";
import {DAFieldSet} from "../StyledMapComponent";
import SingleBandStyling from "./raster/SingleBandStyling";
import MapApi, {MapAPIs} from "../../utils/MapApi";

interface IRasterStylingProps {
    mapVM: MapVM
}

const RasterStyling = (props: IRasterStylingProps) => {
    const uuid = props.mapVM.getLayerOfInterest();
    const [rasterInfo, setRasterInfo] = React.useState(null)
    const getRasterInfo = () => {
        props.mapVM.getApi().get(MapAPIs.DCH_RASTER_DETAIL, {uuid: uuid}).then((payload) => {
            if (payload) {
                setRasterInfo(payload)
            }
        });
    }
    React.useEffect(() => {
        if (!rasterInfo) {
            getRasterInfo()
        }
    }, [])
    return (
        <DAFieldSet>
            <legend>Raster Styling</legend>
            {rasterInfo?.bandCount == 1 ?
                <SingleBandStyling mapVM={props.mapVM} bandInfo={rasterInfo.bandsInfo[0]}/> : <React.Fragment></React.Fragment>
            }
        </DAFieldSet>
    )
}

export default RasterStyling
