import * as React from "react";
import {IControlProps} from "../../TypeDeclaration";
import {IconButton, Tooltip} from "@mui/material";
import LayerSwitcherPaper from "../LayerSwitcher/LayerSwitcherPaper";
import LayersIcon from '@mui/icons-material/Layers';

const LayerSwitcherControl = (props: IControlProps) => {
    // const {drawerRef} = props
    const handleClick = () => {
        props.drawerRef?.current?.addContents("Layer Switcher", <LayerSwitcherPaper mapVM={props.mapVM}/>)
        props.drawerRef?.current?.openDrawer()
        // props.drawerRef?.current?.addHeading()
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
