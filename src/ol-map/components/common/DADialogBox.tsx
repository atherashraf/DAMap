import React from "react";
import {Dialog, DialogActions, DialogTitle} from "@mui/material";
import Button from "@mui/material/Button";
import Paper, {PaperProps} from '@mui/material/Paper';
import Draggable from 'react-draggable';

interface IProps {

}

interface DialogData {
    title?: string
    content: JSX.Element
    actions?: JSX.Element
}

interface IState {
    open: boolean
    title?: string
    content: JSX.Element
    actions?: JSX.Element
}

function PaperComponent(props: PaperProps) {
    return (
        <Draggable
            handle="#draggable-dialog-title"
            cancel={'[class*="MuiDialogContent-root"]'}
        >
            <Paper {...props} />
        </Draggable>
    );
}

class DADialogBox extends React.PureComponent<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            open: false,
            content: <React.Fragment/>
        }


    }

    closeDialog() {
        this.setState({
            open: false, content: <React.Fragment/>
        })
    }

    openDialog(data: DialogData) {
        this.setState({
            open: true, title: data.title, content: data.content,
            actions: data.actions
        })
    }

    updateContents(content: JSX.Element) {
        // const data = Object.assign(this.state.data, {content: content})
        // console.log(data);
        this.setState({content: content})
    }

    render() {
        return (
            <React.Fragment>
                <Dialog scroll={"paper"} onClose={this.closeDialog} open={this.state.open}
                        PaperComponent={PaperComponent}
                        aria-labelledby="draggable-dialog-title">
                    {this.state.title && <DialogTitle style={{cursor: 'move'}}
                                                      id="draggable-dialog-title">{this.state.title}</DialogTitle>}
                    {this.state.content}
                    {this.state.actions && <DialogActions>
                        <Button autoFocus onClick={this.closeDialog.bind(this)}>
                            Close
                        </Button>
                        {this.state.actions}
                    </DialogActions>}
                </Dialog>
            </React.Fragment>
        )
    }
}

export default DADialogBox;
