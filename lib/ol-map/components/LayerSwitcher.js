import * as React from "react";
import "./LayerSwitcher.css";
const LayerSwitcher = (props) => {
    const { mapVM } = props;
    React.useEffect(() => {
        const elem = document.getElementById('div-layer-switcher');
        mapVM.addLayerSwitcher(elem);
    }, []);
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { id: "div-layer-switcher", style: { width: "100%", height: "auto" } })));
};
export default LayerSwitcher;
