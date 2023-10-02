import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import { AppBar, Slide, Toolbar } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface IProps {}

interface IState {
  open: boolean;
  title: string;
  content: JSX.Element;
}

class DAFullScreenDialog extends React.PureComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      open: false,
      title: "",
      content: <React.Fragment />,
    };
  }

  setOpen(value: boolean) {
    this.setState(() => ({ open: value }));
  }

  handleClickOpen = () => {
    this.setOpen(true);
  };
  handleClose = () => {
    this.setOpen(false);
  };

  setContent(title: string, content: JSX.Element) {
    this.setState(() => ({ title: title, content: content }));
  }

  render() {
    return (
      <div>
        {/*<Button variant="outlined" onClick={this.handleClickOpen}>*/}
        {/*    Open full-screen dialog*/}
        {/*</Button>*/}
        <Dialog
          fullScreen
          open={this.state.open}
          onClose={this.handleClose}
          TransitionComponent={Transition}
        >
          <AppBar sx={{ position: "relative" }}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={this.handleClose}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
              <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                {this.state.title}
              </Typography>
              <Button autoFocus color="inherit" onClick={this.handleClose}>
                Close
              </Button>
            </Toolbar>
          </AppBar>
          {/*<Box style={{display:"block", width: "100%", height:  "100%" }}>*/}
          {this.state.content}
          {/*</Box>*/}
        </Dialog>
      </div>
    );
  }
}

export default DAFullScreenDialog;
