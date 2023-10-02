import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

interface IMenuItem {
  name: string;
  handleClick: Function;
}

interface IProps {
  menuList: IMenuItem[];
}

export default function AddStyleButton(props: IProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        variant="contained"
        disableElevation
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
        color={"secondary"}
        fullWidth={true}
      >
        Styling
      </Button>
      <Menu
        id="demo-customized-menu"
        MenuListProps={{
          "aria-labelledby": "demo-customized-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {props.menuList.map((item, index) => (
          <MenuItem
            key={"add-button-menu-" + index}
            onClick={() => item.handleClick()}
          >
            {item.name}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
