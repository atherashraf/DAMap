import React from "react";
import {Slide} from "@mui/material";
import {DrawerPaper, SideDrawerDiv} from "../StyledMapComponent";


interface RightDrawerState {
    open: boolean,
    content: JSX.Element
}

interface RightDrawerProps {
    // initState?: boolean
}


class RightDrawer extends React.PureComponent<RightDrawerProps, RightDrawerState> {
    constructor(props: RightDrawerProps) {
        super(props);
        this.state = {
            open: false,
            content: null
        }
    }

    toggleDrawer() {
        const value: boolean = !this.state.open;
        this.setState({open: value})
    }

    addContents(content: JSX.Element) {
        this.setState({content: content})
    }


    render() {
        return (
            <Slide direction="left" in={this.state.open} mountOnEnter unmountOnExit>
                <SideDrawerDiv >
                    <DrawerPaper elevation={6}>
                        {this.state.content}
                    </DrawerPaper>
                </SideDrawerDiv>
            </Slide>
        )
    }
}

export default RightDrawer
