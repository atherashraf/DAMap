import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
export default function AddStyleButton(props) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    return (React.createElement("div", null,
        React.createElement(Button, { variant: "contained", disableElevation: true, onClick: handleClick, endIcon: React.createElement(KeyboardArrowDownIcon, null), color: "secondary", fullWidth: true }, "Styling"),
        React.createElement(Menu, { id: "demo-customized-menu", MenuListProps: {
                'aria-labelledby': 'demo-customized-button',
            }, anchorEl: anchorEl, open: open, onClose: handleClose }, props.menuList.map((item) => React.createElement(MenuItem, { onClick: () => item.handleClick() }, item.name)))));
}
