import * as React from "react";
const RasterAreaResult = (props) => {
    const { mapVM } = props;
    React.useEffect(() => {
        const elem = document.getElementById('div-area-result');
        mapVM.drawPolygonForRasterArea(elem);
    }, []);
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { id: "div-area-result", style: { width: "100%", height: "auto" } })));
};
export default RasterAreaResult;
