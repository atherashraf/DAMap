import * as React from "react";
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import {IconButton, Tooltip} from "@mui/material";
import {IControlProps} from "../../TypeDeclaration";
import SymbologySetting from "../styling/SymbologySetting";



const SymbologyControl = (props: IControlProps) => {
    const {drawerRef} = props
    const handleClick =  () =>{
        drawerRef.current.addContents(<SymbologySetting key={"symbology-setting"} mapVM={props.mapVM}/>)
        drawerRef.current?.toggleDrawer()
        props.mapVM.refreshMap()
    }
    return (
        <React.Fragment>
            <Tooltip title={"Create Layer Style"}>
                <IconButton sx={{width: 30, height: 30}}
                            onClick={handleClick}>
                    <DesignServicesIcon/>
                </IconButton>
            </Tooltip>
        </React.Fragment>
    )
}

export default SymbologyControl
