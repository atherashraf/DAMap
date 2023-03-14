import * as React from "react";
import { IconButton, Tooltip } from "@mui/material";
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import RasterAreaResult from "../RasterAreaResult";
const RasterArea = (props) => {
    const handleClick = () => {
        var _a, _b, _c, _d;
        console.log("click working...", props.drawerRef);
        (_b = (_a = props.drawerRef) === null || _a === void 0 ? void 0 : _a.current) === null || _b === void 0 ? void 0 : _b.addContents(React.createElement(RasterAreaResult, { mapVM: props.mapVM }));
        (_d = (_c = props.drawerRef) === null || _c === void 0 ? void 0 : _c.current) === null || _d === void 0 ? void 0 : _d.toggleDrawer();
        props.mapVM.refreshMap();
        // props.mapVM.drawPolygonForRasterArea()
    };
    return (React.createElement(React.Fragment, null,
        React.createElement(Tooltip, { title: "Calculate Area" },
            React.createElement(IconButton, { sx: { padding: "3px" }, onClick: handleClick },
                React.createElement(SquareFootIcon, null)))));
};
export default RasterArea;
