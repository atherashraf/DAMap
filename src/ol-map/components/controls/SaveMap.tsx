import * as React from "react";
import {IconButton, Tooltip} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import MapVM from "../../models/MapVM";
import MapApi, {MapAPIs} from "../../utils/MapApi";
import {weatherLayers} from "../../layers/overlay_layers/WeatherLayers";

interface IProps {
    mapVM: MapVM;
}


const SaveMap = (props: IProps) => {
    const handleClick = () => {
        // console.log("mapeInfo", props.mapVM.mapInfo)
        const mapName = props.mapVM.mapInfo.uuid !== "-1"
            ? props.mapVM.mapInfo.title
            : prompt("Please enter map name");
        const mapUUID = props.mapVM.mapInfo ? props.mapVM.mapInfo.uuid : "-1";
        const extent = props.mapVM.getCurrentExtent();
        console.log("Map Name", mapName);

        // @ts-ignore
        const mapData = {
            uuid: mapUUID,
            mapName: mapName,
            extent: extent,
            baseLayer: null,
            daLayers: [],
            otherLayers: [],
        };
        if (mapName) {
            props.mapVM
                .getMap()
                .getAllLayers()
                .forEach((layer) => {
                    const uuid: string = layer.get("name");
                    const title = layer.get("title");
                    const isWeatherLayer = weatherLayers.findIndex(
                        (l) => l.layer_name === uuid
                    );
                    // console.log("is weather layer", isWeatherLayer)
                    if (!uuid && layer.get("baseLayer")) {
                        if (layer.getVisible()) {
                            // const key = Object.keys(baseLayersSources).find((k: string) => baseLayersSources[k].title === title)
                            // baseLayer = title
                            mapData["baseLayer"] = title;
                        }
                    } else if (isWeatherLayer !== -1) {
                        //@ts-ignore
                        mapData["otherLayers"].push({
                            name: uuid,
                            type: "weather",
                            params: {},
                        });
                    } else {
                        //@ts-ignore
                        mapData["daLayers"].push({
                            uuid: uuid,
                            visible: layer.getVisible(),
                            opacity: layer.getOpacity(),
                        });
                    }
                });

            let url = MapApi.getURL(MapAPIs.DCH_SAVE_MAP);
            // url += `?map_name=${mapName}&uuids=${String(uuids)}
            // &baseLayer=${baseLayer}&otherLayers=${String(others)}
            // &extent=${String(extent)}&visibility=${String(visibility)}&mapUUID=${mapUUID}`

            props.mapVM
                .getApi()
                .postFetch(url, mapData)
                .then((payload) => {
                    if (payload) {
                        props.mapVM.showSnackbar("Map created successfully");
                    }
                });
        } else {
            props.mapVM.showSnackbar("Please provide name of the map");
        }
    };
    return (
        <React.Fragment>
            <Tooltip title={"Add Layer"}>
                <IconButton sx={{padding: "3px"}} onClick={handleClick}>
                    <SaveIcon/>
                </IconButton>
            </Tooltip>
        </React.Fragment>
    );
};

export default SaveMap;
