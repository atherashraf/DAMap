import * as React from "react";
import {IconButton, Tooltip} from "@mui/material";
import ZoomInMapIcon from '@mui/icons-material/Info';
import {IControlProps} from "../../TypeDeclaration";


const Identifier = (props: IControlProps) => {
    return (
        <React.Fragment>
            <Tooltip title={"Identify Feature"}>
                <IconButton sx={{padding: "3px"}} onClick={() => props.mapVM.identifyFeature()}>
                    <ZoomInMapIcon/>
                </IconButton>
            </Tooltip>
        </React.Fragment>
    );
}
export default Identifier;
