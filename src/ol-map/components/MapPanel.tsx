import * as React from "react";
import { CircularProgress, Paper} from "@mui/material";
import MapVM from "../models/MapVM";


interface IProps {
    mapVM: MapVM
}

interface IState {
    drawerHeight: number,
    totalMapHeight: number,
    display: "none" | "block"
    contents: JSX.Element
    mapDivHeight: any
}

class MapPanel extends React.PureComponent<IProps, IState> {
    private mapDivId: string;
    public maxMapHeight: number = 300

    constructor(props: IProps) {
        super(props);
        this.mapDivId = "map"
        this.state = {
            drawerHeight: 0,
            totalMapHeight: 0,
            contents: <React.Fragment/>,
            display: "none",
            mapDivHeight: "100%"
        }
    }

    getMaxMapHeight(): number {
        return this.maxMapHeight
    }

    getMapHeight(): number {
        // return document.getElementById(this.mapDivId)?.clientHeight || 0
        return this.state.totalMapHeight
    }


    getMapWidth(): number {
        return document.getElementById(this.mapDivId)?.clientWidth || 0
    }

    isBottomDrawerOpen() {
        return (this.state.drawerHeight > 0)
    }

    closeBottomDrawer() {
        this.setState({display: "none", contents: <React.Fragment/>})
        this.resizeDrawer(0)
        // this.props.mapVM.refreshMap();
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
        this.resizeDrawer(height)
    }

    getDrawerHeight() {
        return this.state.drawerHeight;
    }

    resizeDrawer(height: number) {
        // console.log("table Height", height)
        const {totalMapHeight} = this.state
        const mapDivHeight = height == 0 || totalMapHeight < height ? totalMapHeight + "px" : (totalMapHeight - height) + "px"
        // console.log("map div height", totalMapHeight, mapDivHeight)
        this.setState({
            drawerHeight: height -10,
            mapDivHeight: mapDivHeight
        })
    }

    componentDidUpdate(prevProps: Readonly<IProps>, prevState: Readonly<IState>, snapshot?: any) {
        // console.log("max", this.state.maxMapHeight, "padding", this.state.mapPadding, "drawer", this.state.drawerHeight);
    }

    componentDidMount() {
        const mapHeight = document.getElementById(this.mapDivId).clientHeight
        this.setState({totalMapHeight: mapHeight})
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
        return this.state.totalMapHeight <= this.maxMapHeight ? this.state.drawerHeight + this.state.totalMapHeight : this.state.totalMapHeight
    }

    render() {

        return (
            <Paper sx={{
                width: "100%",
                // height: "auto"
                // height: (this.state.display == "none") ? "100%" : this.getPaperHeight()
                // height: "100%",
            }}
                   elevation={6}>
                <div id={this.mapDivId} style={{
                    width: "100%",
                    height: this.state.mapDivHeight
                }}/>
                <div style={{
                    display: this.state.display,
                    width: "100%",
                    height: this.state.drawerHeight
                }}>
                    {/*<BottomDrawerResizer newMousePos={(mousePosY: number) => {*/}
                    {/*    // const newSize = document.body.offsetHeight - (mousePosY - document.body.offsetTop)*/}
                    {/*    // const newSize = mousePosY - 50*/}
                    {/*    const elem = document.getElementById(this.mapDivId)*/}
                    {/*    const paperHeight = this.getPaperHeight()*/}
                    {/*    const newSize = paperHeight - (mousePosY - elem.offsetTop)*/}
                    {/*    console.log("new Size", newSize)*/}
                    {/*    this.resizeDrawer(newSize)*/}
                    {/*}}/>*/}
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
