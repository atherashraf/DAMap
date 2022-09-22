import * as React from "react";
import {IconButton} from "@mui/material";
import ZoomInMapIcon from '@mui/icons-material/ZoomInMap';
import {IControlProps} from "../../TypeDeclaration";


const Zoom2Extent = (props: IControlProps) => {
    return (
        <React.Fragment>
            <IconButton sx={{padding: "3px"}} onClick={() => props.mapVM.zoomToFullExtent()}>
                <ZoomInMapIcon/>
            </IconButton>
        </React.Fragment>
    );
}
export default Zoom2Extent;
