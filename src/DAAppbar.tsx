import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";

import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import LoginIcon from "@mui/icons-material/Login";
import UserUtils from "./admin/UserUtils";
import { useNavigate } from "react-router-dom";
import MapApi from "./ol-map/utils/MapApi";

export default function DAAppBar(props: any) {
  const [auth, setAuth] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  React.useEffect(() => {
    UserUtils.isLoggedIn().then((res) => {
      setAuth(res);
    });
  }, []);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = () => {
    UserUtils.removeUser();
    setAuth(false);
    navigate("/");
  };
  const handleLogin = () => {
    UserUtils.isLoggedIn().then((res) => {
      console.log("is logedin ", res)
      if (!res) {
        setAuth(false);
        // snackbarRef?.current?.show("Login in process...")
        const formData = new FormData();
        formData.append("username", "ather");
        formData.append("password", "abcd@1234");
        MapApi.authenticate(formData).then((payload) => {
          if (payload) {
            // console.log("payload", payload);
            // setIsAuthenticated(true)
            UserUtils.saveUser(payload);
            setAuth(true);
            // snackbarRef?.current?.hide()
          } else {
            props.snackbarRef?.current?.show(
              "Login Failed. Please check your credentials"
            );
          }
        });
      }
    });
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {auth ? `Welcome ${UserUtils.getUserName()}` : ""}
          </Typography>
          <div>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              {auth ? <AccountCircle /> : <LoginIcon />}
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem
                onClick={() => {
                  handleClose();
                  navigate("/");
                }}
              >
                Home
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleClose();
                  if (auth) {
                    handleLogout();
                  } else {
                    handleLogin();
                  }
                }}
              >
                {auth ? "Logout" : "Login"}
              </MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
