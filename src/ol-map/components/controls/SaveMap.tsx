import * as React from "react";
import {IconButton, Tooltip} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import MapVM from "../../models/MapVM";
import MapApi, {MapAPIs} from "../../utils/MapApi";

interface IProps {
    mapVM: MapVM
}

const SaveMap = (props: IProps) => {
    const handleClick = () => {
        // console.log("mapeInfo", props.mapVM.mapInfo)
        const mapName = props.mapVM.mapInfo? props.mapVM.mapInfo.title :  prompt("Please enter map name")
        const mapUUID = props.mapVM.mapInfo? props.mapVM.mapInfo.uuid : "-1"
        const uuids = []
        const visibility = []
        Object.keys(props.mapVM.daLayers).forEach((uuid) => {
            uuids.push(uuid);
            visibility.push(props.mapVM.daLayers[uuid].getOlLayer().getVisible());
        })

        const extent = props.mapVM.getCurrentExtent()
        console.log(mapName, uuids, extent)
        let url = MapApi.getURL(MapAPIs.DCH_SAVE_MAP)
        url += `?map_name=${mapName}&uuids=${String(uuids.reverse())}
        &extent=${String(extent)}&visibility=${String(visibility)}&mapUUID=${mapUUID}`
        props.mapVM.getApi().getFetch(url).then((payload) => {
            if (payload) {
                props.mapVM.showSnackbar("Map created successfully")
            }
        })
    }
    return (
        <React.Fragment>
            <Tooltip title={"Add Layer"}>
                <IconButton sx={{padding: "3px"}} onClick={handleClick}>
                    <SaveIcon/>
                </IconButton>
            </Tooltip>
        </React.Fragment>
    )
}

export default SaveMap

