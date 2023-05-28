import * as React from "react";
import {Box, CircularProgress, Paper} from "@mui/material";
import MapVM from "../models/MapVM";
import BottomDrawerResizer from "./drawers/BottomDrawerResizer";


interface IProps {
    mapVM: MapVM
}

interface IState {
    drawerHeight: number,
    mapHeight: number,
    display: "none" | "block"
    contents: JSX.Element
}

class MapPanel extends React.PureComponent<IProps, IState> {
    private mapDivId: string;
    public maxMapHeight: number = 300

    constructor(props: IProps) {
        super(props);
        this.mapDivId = "map"
        this.state = {
            drawerHeight: 0,
            mapHeight: 0,
            contents: <React.Fragment/>,
            display: "none",
        }
    }
    getMaxMapHeight(): number{
        return this.maxMapHeight
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
        this.setState({drawerHeight: 0, display: "none", contents: <React.Fragment/>})
        this.props.mapVM.refreshMap();
    }

    openBottomDrawer(height: number, contents: JSX.Element = null) {
        this.resizeDrawer(height)
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

    }

    getDrawerHeight() {
        return this.state.drawerHeight;
    }

    resizeDrawer(height: number) {
        this.setState({
            drawerHeight: height,
        })
    }

    componentDidUpdate(prevProps: Readonly<IProps>, prevState: Readonly<IState>, snapshot?: any) {
        // console.log("max", this.state.maxMapHeight, "padding", this.state.mapPadding, "drawer", this.state.drawerHeight);
    }

    componentDidMount() {
        this.setState({mapHeight: this.getMapHeight()})
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
        console.log(this.state.mapHeight, this.maxMapHeight)
        return this.state.mapHeight <= this.maxMapHeight ? this.state.drawerHeight + this.state.mapHeight : this.state.mapHeight
    }

    render() {

        return (
            <Paper sx={{
                width: "100%",
                height: (this.state.display == "none") ? "100%" : this.getPaperHeight()
                // height: "100%",
            }}
                   elevation={6}>
                <div id={this.mapDivId} style={{
                    width: "100%",
                    height:`calc(100% - ${this.state.drawerHeight}px)`,
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
