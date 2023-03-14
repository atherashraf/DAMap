import * as React from "react";
import {IControlProps} from "../../TypeDeclaration";
import {IconButton, Tooltip} from "@mui/material";
import LayerSwitcher from "../LayerSwitcher";
import LayersIcon from '@mui/icons-material/Layers';

const LayerSwitcherControl = (props: IControlProps) => {
    // const {drawerRef} = props
    const handleClick = () => {
        console.log("click working...", props.drawerRef);
        props.drawerRef?.current?.addContents(<LayerSwitcher mapVM={props.mapVM}/>)
        props.drawerRef?.current?.toggleDrawer()
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
