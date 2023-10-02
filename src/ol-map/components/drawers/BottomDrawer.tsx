import * as React from "react";
import { Box, Drawer, IconButton, Paper } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface BottomDrawerState {
  open: boolean;
  content: JSX.Element;
  container: HTMLElement | null;
}

interface BottomDrawerProps {
  initState: boolean;
  target: string;
}

class BottomDrawer extends React.PureComponent<
  BottomDrawerProps,
  BottomDrawerState
> {
  constructor(props: BottomDrawerProps) {
    super(props);
    this.state = {
      open: props.initState || false,
      content: <div>Attribute Table</div>,
      container: null,
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
    const value: boolean = !this.state.open;
    this.setState(() => ({ open: value }));
  }

  addContents(content: JSX.Element) {
    this.setState(() => ({ content: content }));
  }

  componentDidMount() {
    this.setState(() => ({
      container: document.getElementById(this.props.target),
    }));
  }

  render() {
    return (
      // <Slide direction="up" in={this.state.open} mountOnEnter unmountOnExit>
      <Drawer
        anchor={"bottom"}
        open={this.state.open}
        onClose={this.closeDrawer.bind(this)}
        // PaperProps={{ style: { position: 'absolute' } }}
        // BackdropProps={{style: {position: 'absolute'}}}
        hideBackdrop={true}
        ModalProps={{
          container: document.getElementById(this.props.target),
          style: { position: "absolute" },
        }}
        // ModalProps={this.ref.current ? {container: this.ref.current} : {}}
        variant="temporary"
        // sx={{height:200}}
      >
        <Box
          style={{ boxSizing: "border-box" }}
          sx={{
            display: "flex",
            flexDirection: "column",
            margin: "10px",
            bgcolor: "background.paper",
            mx: 2,
            p: 0,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end",
              p: 0,
              m: 0,
            }}
          >
            <IconButton onClick={this.closeDrawer.bind(this)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Paper sx={{ height: 250 }} elevation={6}>
            {this.state.content}
          </Paper>
        </Box>
      </Drawer>
      // </Slide>
    );
  }
}

export default BottomDrawer;
