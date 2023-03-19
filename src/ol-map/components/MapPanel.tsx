import * as React from "react";
import {Box, CircularProgress, Paper} from "@mui/material";
import MapVM from "../models/MapVM";


interface IProps {
    mapVM: MapVM
}

interface IState {
    drawerHeight: number,
    mapPadding: number,
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
            mapPadding: 0,
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

    isBottomDrawerOpen() {
        return (this.state.drawerHeight !== 0)
    }

    closeBottomDrawer() {
        this.setState({drawerHeight: 0, mapPadding: 0, display: "none", contents: <React.Fragment/>})
        this.props.mapVM.refreshMap();
    }

    openBottomDrawer(height: number, contents: JSX.Element = <CircularProgress/>) {
        // height = this.state.drawerHeight == 0 ? height : 0;
        // const display = this.state.drawerHeight == 0 ? "none" : "block";
        // contents = contents ? contents : <React.Fragment/>
        const mapPadding = height > this.getMapHeight() / 2 ? this.getMapHeight() / 4 : this.getMapHeight() / 2
        this.setState({
            drawerHeight: height, mapPadding: mapPadding,
        })
        this.setContent(contents)

    }

    setContent(contents: JSX.Element = <React.Fragment/>) {
        this.setState({
            display: "block", contents: contents
        })
        // this.props.mapVM.refreshMap();
    }

    closeDrawer() {
        this.setState(() => ({drawerHeight: 0, display: "none"}))
    }

    render() {
        return (
            <Paper sx={{width: "100%", height: "100%"}} elevation={6}>
                <div id={this.mapDivId} style={{
                    width: "100%",
                    height: `calc(100% - ${this.state.mapPadding}px)`,
                }}/>
                <div style={{
                    display: this.state.display,
                    width: "100%",
                    height: this.state.drawerHeight
                }}>
                    <Box style={{boxSizing: "border-box"}} sx={{
                        // display: 'flex', flexDirection: 'column',
                        height: this.state.drawerHeight,
                        bgcolor: 'background.paper',
                        mx: 0, pb: 3
                    }}>
                        {/*<Paper sx={{height: `calc(${this.state.drawerHeight}px - 3px)`,}} elevation={6}>*/}
                        {this.state.contents}
                        {/*</Paper>*/}
                    </Box>
                </div>
            </Paper>
        );
    }
}

export default MapPanel
