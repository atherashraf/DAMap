import * as React from "react";
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import { IconButton, Tooltip } from "@mui/material";
import SymbologySetting from "../styling/SymbologySetting";
const SymbologyControl = (props) => {
    const { drawerRef } = props;
    const handleClick = () => {
        var _a, _b, _c;
        (_a = drawerRef === null || drawerRef === void 0 ? void 0 : drawerRef.current) === null || _a === void 0 ? void 0 : _a.addContents(React.createElement(SymbologySetting, { key: "symbology-setting", mapVM: props.mapVM }));
        (_b = drawerRef === null || drawerRef === void 0 ? void 0 : drawerRef.current) === null || _b === void 0 ? void 0 : _b.toggleDrawer();
        (_c = props.mapVM) === null || _c === void 0 ? void 0 : _c.refreshMap();
    };
    return (React.createElement(React.Fragment, null,
        React.createElement(Tooltip, { title: "Create Layer Style" },
            React.createElement(IconButton, { sx: { width: 30, height: 30 }, onClick: handleClick },
                React.createElement(DesignServicesIcon, null)))));
};
export default SymbologyControl;
