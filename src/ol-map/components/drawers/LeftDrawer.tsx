import * as React from "react";
import {Slide} from "@mui/material";
import {DrawerPaper, SideDrawerDiv} from "../StyledMapComponent";


interface LeftDrawerState {
    open: boolean
    content: JSX.Element
    heading: string
}

interface LeftDrawerProps {
    initState?: boolean
}


class LeftDrawer extends React.PureComponent<LeftDrawerProps, LeftDrawerState> {
    constructor(props: LeftDrawerProps) {
        super(props);
        this.state = {
            open: props.initState || false,
            content: <React.Fragment/>,
            heading: ""
        }
    }

    openDrawer() {
        // const value: boolean = !this.state.open;
        this.setState(()=>({open: true}))
    }

    toggleDrawer() {
        const value: boolean = !this.state.open;
        this.setState(()=>({open: value}))
    }

    addContents(content: JSX.Element) {
        this.setState(()=>({content: content}))
    }

    addHeading(value: string){
        this.setState(()=>({heading: value}))
    }
    render() {
        return (
            <Slide direction="right" in={this.state.open} mountOnEnter unmountOnExit>
                {/*<div style={{*/}
                {/*    width: "250px", height: "99%",*/}
                {/*    display: "flex",*/}
                {/*    backgroundColor: "darkgray",*/}
                {/*    padding: 4*/}
                {/*}}>*/}
                {/*    <Paper elevation={6} sx={{*/}
                {/*        boxSizing: "border-box",*/}
                {/*        width: "100%",*/}
                {/*        height: "100%",*/}
                {/*        color: "white"*/}
                {/*    }}>*/}
                {/*    </Paper>*/}
                {/*</div>*/}
                <SideDrawerDiv>
                    <DrawerPaper elevation={6}>
                        {this.state.content}
                    </DrawerPaper>
                </SideDrawerDiv>
            </Slide>
        )
    }
}


export default LeftDrawer
