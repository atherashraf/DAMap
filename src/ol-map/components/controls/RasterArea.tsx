import * as React from "react";
import {IconButton, Tooltip} from "@mui/material";
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import {IControlProps} from "../../TypeDeclaration";


const RasterArea = (props: IControlProps) => {
    return (
        <React.Fragment>
            <Tooltip title={"Calculate Area"}>
                <IconButton sx={{padding: "3px"}} onClick={() => props.mapVM.drawPolygonForRasterArea()}>
                    <SquareFootIcon/>
                </IconButton>
            </Tooltip>
        </React.Fragment>
    );
}
export default RasterArea;
