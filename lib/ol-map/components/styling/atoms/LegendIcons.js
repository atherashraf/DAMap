import * as React from "react";
import VectorSymbolizer from "../forms/symbolizer/VectorSymbolizer";
import { Button, Paper } from "@mui/material";
import { getPointSVG } from "../forms/symbolizer/PointSymbolizer";
export const LegendIcons = (props) => {
    const [style, setStyle] = React.useState(props.style);
    const vectorStyleRef = React.createRef();
    const dialogBoxRef = props.mapVM.getDialogBoxRef();
    React.useEffect(() => {
        setStyle(props.style);
    }, [props]);
    const handleApplyStyle = () => {
        var _a;
        const params = (_a = vectorStyleRef.current) === null || _a === void 0 ? void 0 : _a.getStyleParams();
        // setStyle(params)
        props.updateStyle(props.index, params);
    };
    const handleClose = () => {
        var _a;
        (_a = dialogBoxRef.current) === null || _a === void 0 ? void 0 : _a.closeDialog();
    };
    const handleClick = () => {
        var _a;
        (_a = dialogBoxRef.current) === null || _a === void 0 ? void 0 : _a.openDialog({
            content: React.createElement(Paper, { elevation: 4, sx: { p: 2, width: 300 } },
                React.createElement(VectorSymbolizer, { ref: vectorStyleRef, geomType: props.geomType, style: props.style })),
            actions: (React.createElement(React.Fragment, null,
                React.createElement(Button, { onClick: handleApplyStyle, autoFocus: true }, "Apply"),
                React.createElement(Button, { onClick: handleClose }, "Close")))
        });
    };
    // const {fillColor, strokeColor, strokeWidth} = style
    const getIcon = () => {
        var _a;
        const gt = ((_a = props.geomType) === null || _a === void 0 ? void 0 : _a.length) == 1 ? props.geomType[0] : "GeometryCollection";
        switch (gt) {
            case "Point":
            case "MultiPoint":
                return getPointSVG(style);
            case "LineString":
            case "MultiLineString":
                return React.createElement("svg", { role: "img", width: "75", height: "30", xmlns: "http://www.w3.org/2000/svg" },
                    React.createElement("line", { x1: "0", y1: "15", x2: "75", y2: "15", style: { stroke: style.strokeColor, strokeWidth: style.strokeWidth } }));
            default:
                return React.createElement("svg", { role: "img", width: "75", height: "30", xmlns: "http://www.w3.org/2000/svg" },
                    React.createElement("rect", { x: "0", y: "0", width: "75", height: "28", style: { fill: style.fillColor,
                            stroke: style.strokeColor,
                            strokeWidth: style.strokeWidth } }));
        }
    };
    // const svg: JSX.Element = getIcon()
    // console.log("svg", svg)
    // setIcon(getIcon())
    return (React.createElement("div", { onClick: handleClick }, getIcon())
    // <Button>Working</Button>
    );
};
