import React from "react";
import {Box, Paper} from "@mui/material";
import MapVM from "../models/MapVM";


interface IProps {
    mapVM: MapVM
}

interface IState {
    drawerHeight: number,
    display: "none" | "block"
    contents: JSX.Element
}

class MapPanel extends React.PureComponent<IProps, IState> {
    private mapDivId: string;

    constructor(props: IProps) {
        super(props);
        this.mapDivId = "map"
        this.state = {
            drawerHeight: 0,
            contents: <React.Fragment/>,
            display: "none"
        }
    }

    getMapHeight(): number {
        return document.getElementById(this.mapDivId)?.clientHeight || 0
    }

    getMapWidth(): number {
        return document.getElementById(this.mapDivId)?.clientWidth || 0
    }

    toggleDrawer(height: number = 250, contents: JSX.Element = <React.Fragment/>) {
        height = this.state.drawerHeight == 0 ? height : 0;
        const display = this.state.drawerHeight == 0 ? "none" : "block";
        contents = contents ? contents : <React.Fragment/>
        this.setState({drawerHeight: height, display: display, contents: contents})
        this.props.mapVM.refreshMap();
    }

    closeDrawer() {
        this.setState(() => ({drawerHeight: 0, display: "none"}))
    }

    render() {
        return (
            <Paper sx={{
                // display: "block",
                // direction: "column",
                width: "100%",
                height: "100%",
                // overflow:"hidden",
                // m:1
            }} elevation={6}>
                <div id={this.mapDivId} style={{
                    width: "100%",
                    height: `calc(100% - ${this.state.drawerHeight}px)`,
                }}/>
                <div style={{
                    // display: this.state.display,
                    width: "100%",
                    height: this.state.drawerHeight
                }}>
                    <Box style={{boxSizing: "border-box"}} sx={{
                        // display: 'flex', flexDirection: 'column',
                        margin: '10px', bgcolor: 'background.paper',
                        mx: 1, p: 0
                    }}>
                        <Paper sx={{height: `calc(${this.state.drawerHeight}px - 10px)`,}} elevation={6}>
                            {this.state.contents}
                        </Paper>
                    </Box>
                </div>
                {/*<RightDrawer ref={rightDrawerRef}/>*/}
            </Paper>
        );
    }
}

export default MapPanel
