import * as React from "react";
import {Box, CircularProgress, Paper} from "@mui/material";
import MapVM from "../models/MapVM";
import BottomDrawerResizer from "./drawers/BottomDrawerResizer";


interface IProps {
    mapVM: MapVM
}

interface IState {
    drawerHeight: number,
    mapPadding: number,
    display: "none" | "block"
    contents: JSX.Element
    maxMapHeight: number
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
            display: "none",
            maxMapHeight: 0,
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
        this.setState({drawerHeight: 0, display: "none", mapPadding: 0, contents: <React.Fragment/>})
        this.props.mapVM.refreshMap();
    }

    openBottomDrawer(height: number, contents: JSX.Element = null) {
        if (!contents) {
            contents = <div style={{
                display: 'flex', position: "relative",
                top: "30%", margin: "0px", padding: "0px",
                justifyContent: 'center', height: this.state.drawerHeight
            }}>
                <CircularProgress color="secondary"/>
            </div>
        }

        this.setContent(contents)
        this.resizeDrawer(height)
    }

    getDrawerHeight() {
        return this.state.drawerHeight;
    }

    resizeDrawer(height: number) {
        const checkHeight = 150
        this.setState({
            drawerHeight: height > checkHeight ? height : 300,
            mapPadding: height
        })

    }

    componentDidUpdate(prevProps: Readonly<IProps>, prevState: Readonly<IState>, snapshot?: any) {
        // console.log("max", this.state.maxMapHeight, "padding", this.state.mapPadding, "drawer", this.state.drawerHeight);
    }

    componentDidMount() {
        this.setState({maxMapHeight: this.getMapHeight()})
    }

    setContent(contents: JSX.Element = <React.Fragment/>) {
        this.setState({
            display: "block",
            contents: contents,
        })
        // this.props.mapVM.refreshMap();
    }

    closeDrawer() {
        this.setState(() => ({drawerHeight: 0, display: "none"}))
    }

    getPaperHeight() {

        const totalHeight = this.state.drawerHeight + (this.state.maxMapHeight - this.state.mapPadding)
        return this.state.maxMapHeight + 10 < totalHeight ? totalHeight : this.state.maxMapHeight
    }

    render() {

        return (
            <Paper sx={{width: "100%", height: (!this.state.maxMapHeight || this.state.display =="none") ? "100%" : this.getPaperHeight()}}
                   elevation={6}>
                <div id={this.mapDivId} style={{
                    width: "100%",
                    height: `calc(100% - ${this.state.mapPadding}px)`,
                }}/>
                <div style={{
                    display: this.state.display,
                    width: "100%",
                    height: this.state.drawerHeight
                }}>
                    <BottomDrawerResizer newMousePos={(mousePosY: number) => {
                        const newSize = document.body.offsetHeight - (mousePosY - document.body.offsetTop + 50)
                        // const newSize = mousePosY - 50
                        this.resizeDrawer(newSize)
                    }}/>
                    <div id={"bottom-drawer-div"}
                         style={{boxSizing: "border-box", height: this.state.drawerHeight}}
                    >
                        {/*<Paper sx={{height: `calc(${this.state.drawerHeight}px - 3px)`,}} elevation={6}>*/}
                        {this.state.contents}
                        {/*</Paper>*/}
                    </div>
                </div>
            </Paper>
        );
    }
}

export default MapPanel
