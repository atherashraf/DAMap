import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
export default class DASnackbar extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            message: ""
        };
    }
    setOpen(value) {
        this.setState({ open: value });
    }
    handleClose(event, reason) {
        if (reason === 'clickaway') {
            return;
        }
        this.setOpen(false);
    }
    ;
    show(message, actions = React.createElement(React.Fragment, null)) {
        this.setState({ message: message, open: true, actions: actions });
    }
    hide() {
        this.setState({ message: "", open: false, actions: React.createElement(React.Fragment, null) });
    }
    render() {
        return (React.createElement("div", null,
            React.createElement(Snackbar, { open: this.state.open, autoHideDuration: 6000, onClose: this.handleClose.bind(this), message: this.state.message })));
    }
}
