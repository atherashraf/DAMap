import * as React from "react";
import { Box, Drawer, IconButton, Paper } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
class BottomDrawer extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            open: props.initState || false,
            content: React.createElement("div", null, "Attribute Table"),
            container: null
        };
    }
    openDrawer() {
        // const value: boolean = !this.state.open;
        this.setState(() => ({ open: true }));
    }
    closeDrawer() {
        this.setState(() => ({ open: false }));
    }
    toggleDrawer() {
        const value = !this.state.open;
        this.setState(() => ({ open: value }));
    }
    addContents(content) {
        this.setState(() => ({ content: content }));
    }
    componentDidMount() {
        this.setState(() => ({ container: document.getElementById(this.props.target) }));
    }
    render() {
        return (
        // <Slide direction="up" in={this.state.open} mountOnEnter unmountOnExit>
        React.createElement(Drawer, { anchor: "bottom", open: this.state.open, onClose: this.closeDrawer.bind(this), 
            // PaperProps={{ style: { position: 'absolute' } }}
            // BackdropProps={{style: {position: 'absolute'}}}
            hideBackdrop: true, ModalProps: {
                container: document.getElementById(this.props.target),
                style: { position: 'absolute' }
            }, 
            // ModalProps={this.ref.current ? {container: this.ref.current} : {}}
            variant: "temporary" },
            React.createElement(Box, { style: { boxSizing: "border-box" }, sx: {
                    display: 'flex', flexDirection: 'column',
                    margin: '10px', bgcolor: 'background.paper',
                    mx: 2, p: 0
                } },
                React.createElement(Box, { sx: { display: 'flex', flexDirection: 'row', justifyContent: "flex-end", p: 0, m: 0 } },
                    React.createElement(IconButton, { onClick: this.closeDrawer.bind(this) },
                        React.createElement(CloseIcon, null))),
                React.createElement(Paper, { sx: { height: 250 }, elevation: 6 }, this.state.content)))
        // </Slide>
        );
    }
}
export default BottomDrawer;
