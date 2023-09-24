import {AppBar, Box, Button, Stack} from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import MapView from "./MapView";
import * as React from "react";

interface IProps {
    uuid: string
    title: string
    children?: any
}


const MapContainer =
    React.forwardRef((props: IProps, ref: React.ForwardedRef<MapView>) => {
        const appbarHeight = 60;
        return (
            <div id={"map-component"} style={{width: "100%", height: "100%"}}>
                <Stack sx={{width: "100%", height: "100%"}}>
                    <AppBar position="static" sx={{height: appbarHeight, mt: 1}} color={"secondary"}>
                        <Toolbar>
                            <Box sx={{flexGrow: 1}}>
                                <Typography variant="h6" component="div">
                                    {props.title}
                                </Typography>
                            </Box>
                            {props.children}
                        </Toolbar>-
                    </AppBar>
                    <Box
                        sx={{
                            width: "100%",
                            height: `calc(100%  - ${appbarHeight}px)`,
                            minHeight: "400px",
                            p: 0,
                            m: 0,
                        }}
                    >
                        <MapView ref={ref} uuid={props.uuid} isMap={true} isDesigner={false}/>
                    </Box>
                </Stack>
            </div>
        )
    })

export default MapContainer;
