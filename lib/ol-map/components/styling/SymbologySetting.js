import * as React from "react";
import { useEffect } from "react";
import { Box, Button, FormControl, InputLabel, MenuItem } from "@mui/material";
import { DAFieldSet, DASelect } from "../StyledMapComponent";
import SingleStyleForm from "./forms/SingleStyleForm";
import { MapAPIs } from "../../utils/MapApi";
import DensityStyleForm from "./forms/DensityStyleForm";
import MultipleStyleForm from "./forms/MultipleStyleForm";
const SymbologySetting = (props) => {
    var _a;
    const [styleType, setStyleType] = React.useState('');
    const layerId = props.mapVM.getLayerOfInterest();
    const currentStyle = (_a = props.mapVM.getDALayer(layerId)) === null || _a === void 0 ? void 0 : _a.style;
    useEffect(() => {
        if (currentStyle)
            setStyleType(currentStyle.type);
    }, [currentStyle]);
    const styleTypes = [{ name: "Single", val: "single" },
        { name: "Multiple", val: "multiple" },
        { name: "Density", val: "density" }];
    const styleFormRef = React.createRef();
    const handleSelectType = (event) => {
        const styleType = event.target.value;
        setStyleType(styleType);
    };
    const handleSetStyle = () => {
        const style = styleFormRef.current.getFeatureStyle();
        // style.style.default.pointShape = pointShape
        // style.style.rules = style.style.rules.map((rule) => {
        //     rule.style.pointShape = pointShape
        //     return rule
        // })
        // console.log("set style", style)
        const daLayer = props.mapVM.getDALayer(layerId);
        daLayer.setStyle(style);
    };
    const handleSaveStyle = () => {
        var _a;
        const style = (_a = styleFormRef.current) === null || _a === void 0 ? void 0 : _a.getFeatureStyle();
        props.mapVM.getApi().post(MapAPIs.DCH_SAVE_STYLE, style, { uuid: layerId }).then(() => {
            props.mapVM.showSnackbar("Style save successfully");
        });
    };
    return (React.createElement(Box, { sx: { width: "100%", boxSizing: "border-box", p: 1 } },
        React.createElement(DAFieldSet, null,
            React.createElement("legend", null, "Vector Styling"),
            React.createElement(FormControl, { fullWidth: true, size: "small" },
                React.createElement(InputLabel, { id: "style-type-label" }, "Style Type"),
                React.createElement(DASelect, { labelId: "style-type-label", id: "style-type-select", value: styleType, label: "Style Type", onChange: handleSelectType }, styleTypes.map(({ name, val }) => React.createElement(MenuItem, { key: `${name}-key`, value: val }, name)))),
            styleType === "single" ?
                React.createElement(SingleStyleForm, { key: "single-style", layerId: layerId, mapVM: props.mapVM, 
                    // pointShape={pointShape}
                    //@ts-ignore
                    ref: styleFormRef })
                : styleType === "density" ?
                    React.createElement(DensityStyleForm, { key: "density-style", layerId: layerId, mapVM: props.mapVM, 
                        // pointShape={pointShape}
                        //@ts-ignore
                        ref: styleFormRef })
                    : styleType === "multiple" ?
                        React.createElement(MultipleStyleForm, { key: "multiple-style", mapVM: props.mapVM, layerId: layerId, 
                            // pointShape={pointShape}
                            //@ts-ignore
                            ref: styleFormRef })
                        : React.createElement(React.Fragment, null),
            React.createElement(Box, { sx: { m: 1 } },
                React.createElement(Button, { fullWidth: true, color: "primary", variant: "contained", onClick: handleSetStyle }, "Set Style")),
            React.createElement(Box, { sx: { m: 1 } },
                React.createElement(Button, { fullWidth: true, color: "success", variant: "contained", onClick: handleSaveStyle }, "Save Style")))));
};
export default SymbologySetting;
