import * as React from "react";
import {AppBar, Box, IconButton, Paper, Slide, Toolbar, Typography} from "@mui/material";
import {DrawerPaper, SideDrawerDiv} from "../StyledMapComponent";
import CloseIcon from '@mui/icons-material/Close';
import autoBind from "auto-bind";


interface RightDrawerState {
    open: boolean,
    content: JSX.Element,
    heading: string
    isResizing: boolean
    lastDownX: any
    width: number
}

interface RightDrawerProps {
    // initState?: boolean
}


class RightDrawer extends React.PureComponent<RightDrawerProps, RightDrawerState> {
    constructor(props: RightDrawerProps) {
        super(props);
        this.state = {
            open: false,
            content: <React.Fragment/>,
            heading: "working...",
            isResizing: false,
            lastDownX: null,
            width: 350
        }
        autoBind(this)
    }

    openDrawer() {
        !this.state.open && this.setState(() => ({open: true}))
    }

    toggleDrawer() {
        const value: boolean = !this.state.open;
        this.setState(() => ({open: value}))
    }

    closeDrawer() {
        const value: boolean = false;
        this.setState(() => ({open: value}))

    }


    addContents( heading: string, content: JSX.Element) {
        this.setState(() => ({content: content, heading: heading}))
    }

    addHeading(value: string) {
        this.setState(() => ({heading: value}))
    }

    handleMousedown(e) {
        this.setState({isResizing: true, lastDownX: e.clientX});
    }

    handleMousemove = e => {
        // we don't want to do anything if we aren't resizing.
        if (!this.state.isResizing) {
            return;
        }

        let offsetRight =
            document.body.offsetWidth - (e.clientX - document.body.offsetLeft);
        let minWidth = 50;
        let maxWidth = 600;
        if (offsetRight > minWidth && offsetRight < maxWidth) {
            this.setState(()=>({width: offsetRight}))
        }
    }

    handleMouseup = e => {
        this.setState({isResizing: false});
    }

    componentDidMount() {
        document.addEventListener('mousemove', e => this.handleMousemove(e));
        document.addEventListener('mouseup', e => this.handleMouseup(e));
    }

    render() {
        return (

            <Slide direction="left" in={this.state.open}
                   mountOnEnter unmountOnExit>
                <Box sx={{
                    display: "flex",
                    alignItems: 'flex-start',
                    flexDirection: 'column',
                    minWidth: "200px",
                    width: this.state.width + "px",
                    bgcolor: 'background.paper'
                }}>
                    <AppBar position="static"
                            sx={{
                                height: "30px",
                                p: 0,
                                m: 0
                            }}
                            color={"secondary"}>
                        <Toolbar style={{padding: 0, margin: 0, minHeight: "30px"}}>
                            <Typography variant="h6" component="div"
                                        sx={{flexGrow: 1}}>
                                {this.state.heading}
                            </Typography>
                            <IconButton style={{color: "white"}}
                                        onClick={this.closeDrawer.bind(this)}>
                                <CloseIcon/>
                            </IconButton>
                        </Toolbar>
                    </AppBar>
                    <DrawerPaper elevation={6} sx={{
                        display: "flex",
                        flexDirection: "row",
                        backgroundColor: "white"
                    }}>
                        <div
                            id="dragger"
                            onMouseDown={event => {
                                this.handleMousedown(event);
                            }}
                            style={{
                                width: '4px',
                                // height:"100px",
                                cursor: 'ew-resize',
                                padding: '4px 0 0',
                                borderTop: '1px solid #ddd',
                                position: 'relative',
                                top: 0,
                                left: 0,
                                bottom: 0,
                                zIndex: '100',
                                backgroundColor: '#f4f7f9'
                            }}
                        />
                        <Box sx={{flexGrow: 1, color:"black", width:"90%"}}>
                            {this.state.content}
                        </Box>
                    </DrawerPaper>
                </Box>
            </Slide>
        )
    }
}

export default RightDrawer
