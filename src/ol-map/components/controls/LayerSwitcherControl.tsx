import * as React from "react";
import {IControlProps} from "../../utils/TypeDeclaration";
import SymbologySetting from "../styling/SymbologySetting";
import {IconButton, Tooltip} from "@mui/material";
import LayerSwitcher from "../LayerSwitcher";
import LayersIcon from '@mui/icons-material/Layers';
import mapVM from "../../models/MapVM";

const LayerSwitcherControl = (props: IControlProps) => {
    const {drawerRef} = props
    const handleClick =  () =>{
        drawerRef.current.addContents(<LayerSwitcher mapVM={props.mapVM} />)
        drawerRef?.current?.toggleDrawer()
        props.mapVM.refreshMap();
    }
    return (
        <React.Fragment>
            <Tooltip title={"Create Layer Style"}>
                <IconButton sx={{width: 30, height: 30}}
                            onClick={handleClick}>
                    <LayersIcon/>
                </IconButton>
            </Tooltip>
        </React.Fragment>
    )

}

export default LayerSwitcherControl
