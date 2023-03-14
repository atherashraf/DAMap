import * as React from "react";
import MapView from "./MapView";
const LayerDesigner = (props) => {
    return (React.createElement(React.Fragment, null,
        React.createElement(MapView, { uuid: props.layerId, isMap: false, isDesigner: true })));
};
export default LayerDesigner;
