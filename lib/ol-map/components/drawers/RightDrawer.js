import * as React from "react";
import { Slide } from "@mui/material";
import { DrawerPaper, SideDrawerDiv } from "../StyledMapComponent";
class RightDrawer extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            content: React.createElement(React.Fragment, null)
        };
    }
    openDrawer() {
        this.setState(() => ({ open: true }));
    }
    toggleDrawer() {
        const value = !this.state.open;
        this.setState(() => ({ open: value }));
    }
    addContents(content) {
        this.setState(() => ({ content: content }));
    }
    render() {
        return (React.createElement(Slide, { direction: "left", in: this.state.open, mountOnEnter: true, unmountOnExit: true },
            React.createElement(SideDrawerDiv, null,
                React.createElement(DrawerPaper, { elevation: 6 }, this.state.content))));
    }
}
export default RightDrawer;
