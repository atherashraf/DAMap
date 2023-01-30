import * as React from "react";
import {IconButton, Tooltip} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import {IControlProps, ILayerInfo} from "../../TypeDeclaration";
import AddLayerPanel from "../AddLayerPanel";
import {MapAPIs} from "../../utils/MapApi";


const AddLayer = (props: IControlProps) => {
    const handleClick = async () => {
        let data = [
            {"uuid": "586bcff2-5a85-11ed-beb3-acde48001122", "title": "Rabi 2021-22", "layer_name": "Rabi_2021-22"},
            {"uuid": "2c6baf19-793f-11ed-8936-601895253350", "title": "water quality", "layer_name": "water_quality"}]
        const payload: any = await props.mapVM.api.get(MapAPIs.DCH_GET_ALL_LAYERS)
        if (payload) {
            data = payload
        }
        props.drawerRef?.current?.addContents(<AddLayerPanel mapVM={props.mapVM} layers={data}/>)
        props.drawerRef?.current?.toggleDrawer()
        props.mapVM.refreshMap();
    }
    return (
        <React.Fragment>
            <Tooltip title={"Add Layer"}>
                <IconButton sx={{padding: "3px"}} onClick={handleClick}>
                    <AddIcon/>
                </IconButton>
            </Tooltip>
        </React.Fragment>
    );
}
export default AddLayer;
