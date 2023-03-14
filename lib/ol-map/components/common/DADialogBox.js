import * as React from "react";
import { Dialog, DialogActions, DialogTitle } from "@mui/material";
import Button from "@mui/material/Button";
import Paper from '@mui/material/Paper';
import Draggable from 'react-draggable';
function PaperComponent(props) {
    return (React.createElement(Draggable, { handle: "#draggable-dialog-title", cancel: '[class*="MuiDialogContent-root"]' },
        React.createElement(Paper, Object.assign({}, props))));
}
class DADialogBox extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            content: React.createElement(React.Fragment, null)
        };
    }
    closeDialog() {
        this.setState({
            open: false, content: React.createElement(React.Fragment, null)
        });
    }
    openDialog(data) {
        this.setState({
            open: true, title: data.title, content: data.content,
            actions: data.actions
        });
    }
    updateContents(content) {
        // const data = Object.assign(this.state.data, {content: content})
        // console.log(data);
        this.setState({ content: content });
    }
    render() {
        return (React.createElement(React.Fragment, null,
            React.createElement(Dialog, { scroll: "paper", onClose: this.closeDialog, open: this.state.open, PaperComponent: PaperComponent, "aria-labelledby": "draggable-dialog-title" },
                this.state.title && React.createElement(DialogTitle, { style: { cursor: 'move' }, id: "draggable-dialog-title" }, this.state.title),
                this.state.content,
                this.state.actions && React.createElement(DialogActions, null,
                    React.createElement(Button, { autoFocus: true, onClick: this.closeDialog.bind(this) }, "Close"),
                    this.state.actions))));
    }
}
export default DADialogBox;
