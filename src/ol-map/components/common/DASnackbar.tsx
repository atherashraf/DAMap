import * as React from "react";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

interface IProp {}

interface IState {
  open: boolean;
  message: string;
  actions?: JSX.Element;
  autoHideDuration: number;
}

export default class DASnackbar extends React.PureComponent<IProp, IState> {
  constructor(props: IProp) {
    super(props);
    this.state = {
      open: false,
      message: "",
      autoHideDuration: 5000,
      // actions:
    };
  }

  setOpen(value: boolean) {
    this.setState({ open: value });
  }

  // @ts-ignore
  handleClose(event: React.SyntheticEvent | Event, reason?: string) {
    if (reason === "clickaway") {
      return;
    }
    this.setOpen(false);
  }

  show(
    message: string,
    actions: JSX.Element = <React.Fragment />,
    autoHideDuration = 6000
  ) {
    this.setState({
      message: message,
      open: true,
      actions: actions,
      autoHideDuration: autoHideDuration,
    });
  }

  hide() {
    this.setState({ message: "", open: false, actions: <React.Fragment /> });
  }

  render() {
    return (
      <div>
        <Snackbar
          open={this.state.open}
          autoHideDuration={this.state.autoHideDuration}
          onClose={this.handleClose.bind(this)}
          message={this.state.message}
          action={
            <React.Fragment>
              <IconButton
                aria-label="close"
                color="inherit"
                sx={{ p: 0.5 }}
                onClick={this.handleClose.bind(this)}
              >
                <CloseIcon />
              </IconButton>
            </React.Fragment>
          }
        />
      </div>
    );
  }
}
