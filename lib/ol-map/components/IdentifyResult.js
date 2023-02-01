import * as React from "react";
const IdentifyResult = (props) => {
    const { mapVM } = props;
    React.useEffect(() => {
        const elem = document.getElementById('div-identify-result');
        mapVM.identifyFeature(elem);
    }, []);
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { id: "div-identify-result", style: { width: "100%", height: "auto" } })));
};
export default IdentifyResult;
