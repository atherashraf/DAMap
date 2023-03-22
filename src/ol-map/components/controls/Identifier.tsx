import * as React from "react";
import {IconButton, Tooltip} from "@mui/material";
import ZoomInMapIcon from '@mui/icons-material/Info';
import {IControlProps} from "../../TypeDeclaration";
import IdentifyResult from "../IdentifyResult";


const Identifier = (props: IControlProps) => {
    const handleClick = () => {
        props.drawerRef?.current?.addContents(<IdentifyResult mapVM={props.mapVM}/>)
        props.drawerRef?.current?.toggleDrawer()
        props.mapVM.refreshMap();
        // props.mapVM.identifyFeature();

    }
    return (
        <React.Fragment>
            <Tooltip title={"Identify Feature"}>
                <IconButton sx={{padding: "3px"}} onClick={handleClick}>
                    <ZoomInMapIcon/>
                </IconButton>
            </Tooltip>
        </React.Fragment>
    );
}
export default Identifier;
