import * as React from "react";
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import {IconButton, Tooltip} from "@mui/material";
import {IControlProps} from "../../utils/TypeDeclaration";



const SymbologyControl = (props: IControlProps) => {
    const {drawerRef} = props
    return (
        <React.Fragment>
            <Tooltip title={"Create Layer Style"}>
                <IconButton sx={{width: 30, height: 30}}
                            onClick={() => drawerRef?.current?.toggleDrawer()}>
                    <DesignServicesIcon/>
                </IconButton>
            </Tooltip>
        </React.Fragment>
    )
}

export default SymbologyControl
