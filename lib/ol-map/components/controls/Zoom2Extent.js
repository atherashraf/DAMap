import * as React from "react";
import { IconButton, Tooltip } from "@mui/material";
import ZoomInMapIcon from '@mui/icons-material/ZoomInMap';
const Zoom2Extent = (props) => {
    return (React.createElement(React.Fragment, null,
        React.createElement(Tooltip, { title: "Zoom to Map Extent" },
            React.createElement(IconButton, { sx: { padding: "3px" }, onClick: () => props.mapVM.zoomToFullExtent() },
                React.createElement(ZoomInMapIcon, null)))));
};
export default Zoom2Extent;
