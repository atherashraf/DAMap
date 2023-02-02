import * as React from "react";
import { IconButton, Tooltip } from "@mui/material";
import LayerSwitcher from "../LayerSwitcher";
import LayersIcon from '@mui/icons-material/Layers';
const LayerSwitcherControl = (props) => {
    // const {drawerRef} = props
    const handleClick = () => {
        var _a, _b, _c, _d;
        console.log("click working...", props.drawerRef);
        (_b = (_a = props.drawerRef) === null || _a === void 0 ? void 0 : _a.current) === null || _b === void 0 ? void 0 : _b.addContents(React.createElement(LayerSwitcher, { mapVM: props.mapVM }));
        (_d = (_c = props.drawerRef) === null || _c === void 0 ? void 0 : _c.current) === null || _d === void 0 ? void 0 : _d.toggleDrawer();
        props.mapVM.refreshMap();
    };
    return (React.createElement(React.Fragment, null,
        React.createElement(Tooltip, { title: "Create Layer Style" },
            React.createElement(IconButton, { sx: { width: 30, height: 30 }, onClick: handleClick },
                React.createElement(LayersIcon, null)))));
};
export default LayerSwitcherControl;