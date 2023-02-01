import * as React from "react";
import { Box, Paper } from "@mui/material";
class MapPanel extends React.PureComponent {
    constructor(props) {
        super(props);
        this.mapDivId = "map";
        this.state = {
            drawerHeight: 0,
            mapPadding: 0,
            contents: React.createElement(React.Fragment, null),
            display: "none"
        };
    }
    getMapHeight() {
        var _a;
        return ((_a = document.getElementById(this.mapDivId)) === null || _a === void 0 ? void 0 : _a.clientHeight) || 0;
    }
    getMapWidth() {
        var _a;
        return ((_a = document.getElementById(this.mapDivId)) === null || _a === void 0 ? void 0 : _a.clientWidth) || 0;
    }
    isBottomDrawerOpen() {
        return (this.state.drawerHeight !== 0);
    }
    closeBottomDrawer() {
        this.setState({ drawerHeight: 0, mapPadding: 0, display: "none", contents: React.createElement(React.Fragment, null) });
        this.props.mapVM.refreshMap();
    }
    openBottomDrawer(height, contents = React.createElement(React.Fragment, null)) {
        // height = this.state.drawerHeight == 0 ? height : 0;
        // const display = this.state.drawerHeight == 0 ? "none" : "block";
        // contents = contents ? contents : <React.Fragment/>
        const mapPadding = height > this.getMapHeight() / 2 ? this.getMapHeight() / 4 : this.getMapHeight() / 2;
        // const mapPadding = this.getMapHeight() / 2
        this.setState({
            drawerHeight: height, mapPadding: mapPadding,
            display: "block", contents: contents
        });
        this.props.mapVM.refreshMap();
    }
    closeDrawer() {
        this.setState(() => ({ drawerHeight: 0, display: "none" }));
    }
    render() {
        return (React.createElement(Paper, { sx: {
                width: "100%",
                height: "100%",
            }, elevation: 6 },
            React.createElement("div", { id: this.mapDivId, style: {
                    width: "100%",
                    height: `calc(100% - ${this.state.mapPadding}px)`,
                } }),
            React.createElement("div", { style: {
                    display: this.state.display,
                    width: "100%",
                    height: this.state.drawerHeight
                } },
                React.createElement(Box, { style: { boxSizing: "border-box" }, sx: {
                        // display: 'flex', flexDirection: 'column',
                        height: this.state.drawerHeight,
                        bgcolor: 'background.paper',
                        mx: 0, pb: 3
                    } },
                    React.createElement(Paper, { sx: { height: `calc(${this.state.drawerHeight}px - 10px)`, }, elevation: 6 }, this.state.contents)))));
    }
}
export default MapPanel;
