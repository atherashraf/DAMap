import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';

interface IProp {

}

interface IState {
    open: boolean
    message: string,
    actions?: JSX.Element
}

export default class DASnackbar extends React.PureComponent<IProp, IState> {
    constructor(props: IProp) {
        super(props);
        this.state = {
            open: false,
            message: ""
        }
    }

    setOpen(value: boolean) {
        this.setState({open: value})
    }


    handleClose(event: React.SyntheticEvent | Event, reason?: string) {
        if (reason === 'clickaway') {
            return;
        }
        this.setOpen(false);
    };

    show(message: string, actions: JSX.Element = <React.Fragment/>) {
        this.setState({message: message, open: true, actions: actions})
    }

    hide() {
        this.setState({message: "", open: false, actions: <React.Fragment/>})
    }


    render() {
        return (
            <div>
                <Snackbar
                    open={this.state.open}
                    autoHideDuration={6000}
                    onClose={this.handleClose.bind(this)}
                    message={this.state.message}
                    // action={this.state.actions}
                />
            </div>
        )
    }

}
