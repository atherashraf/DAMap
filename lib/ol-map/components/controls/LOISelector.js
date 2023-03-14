import * as React from "react";
const LOISelector = (props) => {
    const [layerIds, setLayerIds] = React.useState([]);
    window.addEventListener('VectorLayerAdded', () => {
        const k = Object.keys(props.mapVM.daLayers);
        setLayerIds(k);
        props.mapVM.setLayerOfInterest(k[0]);
    });
    return (React.createElement(React.Fragment, null,
        React.createElement("select", { style: {
                backgroundColor: "transparent",
                border: "2px solid #000",
                width: "200px"
            }, onChange: (e) => props.mapVM.setLayerOfInterest(e.target.value) }, layerIds.map((layerId) => {
            const layer = props.mapVM.getDALayer(layerId);
            return React.createElement("option", { value: layerId }, layer.getLayerTitle());
        }))));
};
export default LOISelector;
