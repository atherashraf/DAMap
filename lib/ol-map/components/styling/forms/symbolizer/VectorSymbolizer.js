import autoBind from "auto-bind";
import * as React from "react";
import { Box, TextField } from "@mui/material";
import DAColorPicker from "../../DAColorPicker";
import PointSymbolizer from "./PointSymbolizer";
import _ from "../../../../utils/lodash";
class VectorSymbolizer extends React.PureComponent {
    constructor(props) {
        super(props);
        this.minStrokeWidth = 1;
        this.maxStrokeWidth = 10;
        this.strokeColorRef = React.createRef();
        this.fillColorRef = React.createRef();
        this.pointSymbolRef = React.createRef();
        autoBind(this);
        const { style } = this.props;
        this.state = {
            strokeWidth: (style === null || style === void 0 ? void 0 : style.strokeWidth) || 1,
            errorStrokeWidth: "",
            errorNoOfClasses: "",
            strokeColor: (style === null || style === void 0 ? void 0 : style.strokeColor) || "#404abf",
            fillColor: (style === null || style === void 0 ? void 0 : style.fillColor) || "rgba(27,32,109,0.67)"
        };
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (!_.isEqual(prevProps.style, this.props.style)) {
            const style = this.props.style;
            this.setState({
                strokeWidth: style.strokeWidth,
                strokeColor: style.strokeColor,
                fillColor: style.fillColor
            });
        }
    }
    getStyleParams() {
        var _a, _b, _c, _d, _e, _f;
        const isError = this.validateForm();
        if (!isError) {
            const params = {};
            const ps = (_b = (_a = this.pointSymbolRef) === null || _a === void 0 ? void 0 : _a.current) === null || _b === void 0 ? void 0 : _b.getPointSymbolizer();
            if (ps) {
                params.pointSize = ps.pointSize;
                params.pointShape = ps.pointShape;
            }
            if ((_d = (_c = this.strokeColorRef) === null || _c === void 0 ? void 0 : _c.current) === null || _d === void 0 ? void 0 : _d.getColor()) {
                params["strokeColor"] = this.strokeColorRef.current.getColor();
                params["strokeWidth"] = this.state.strokeWidth;
            }
            if ((_f = (_e = this.fillColorRef) === null || _e === void 0 ? void 0 : _e.current) === null || _f === void 0 ? void 0 : _f.getColor())
                params["fillColor"] = this.fillColorRef.current.getColor();
            return params;
        }
        return null;
    }
    validateForm() {
        const isStrokeWidthError = this.validateStrokeWidth();
        return (isStrokeWidthError);
    }
    validateStrokeWidth(val = 0) {
        var _a;
        val = val ? val : (_a = this.state) === null || _a === void 0 ? void 0 : _a.strokeWidth;
        let isError = false;
        if (val < this.minStrokeWidth || val > this.maxStrokeWidth) {
            this.setState({ errorNoOfClasses: "classes must be between 1 to 10" });
            isError = true;
        }
        else
            this.setState({ errorNoOfClasses: null });
        return isError;
    }
    render() {
        var _a, _b, _c, _d, _e;
        // console.log("geomType", this.props.geomType)
        return (React.createElement(React.Fragment, null,
            React.createElement(Box, { sx: { flex: 1 } },
                React.createElement(PointSymbolizer, { ref: this.pointSymbolRef, pointSize: (_a = this.props.style) === null || _a === void 0 ? void 0 : _a.pointSize, pointShape: (_b = this.props.style) === null || _b === void 0 ? void 0 : _b.pointShape })),
            React.createElement(Box, { sx: { flex: 1 } },
                React.createElement("fieldset", null,
                    React.createElement("legend", null, "Stroke Width"),
                    React.createElement(TextField, { type: "number", color: "primary", variant: "outlined", fullWidth: true, value: (_c = this.state) === null || _c === void 0 ? void 0 : _c.strokeWidth, onChange: (e) => {
                            this.setState({ strokeWidth: parseInt(e.target.value) });
                            this.validateStrokeWidth(parseInt(e.target.value));
                        }, onBlur: (e) => this.validateStrokeWidth(parseInt(e.target.value)), required: true, error: Boolean((_d = this.state) === null || _d === void 0 ? void 0 : _d.errorStrokeWidth), helperText: (_e = this.state) === null || _e === void 0 ? void 0 : _e.errorStrokeWidth, InputProps: {
                            inputProps: {
                                min: this.minStrokeWidth,
                                max: this.maxStrokeWidth
                            }
                        } }))),
            React.createElement(Box, { sx: { flex: 1 } },
                React.createElement(DAColorPicker, { ref: this.strokeColorRef, label: "Stroke Color", color: this.state.strokeColor, isAlpha: false })),
            React.createElement(Box, { sx: { flex: 1 } },
                React.createElement(DAColorPicker, { ref: this.fillColorRef, label: "Fill Color", color: this.state.fillColor, isAlpha: true }))));
    }
}
export default VectorSymbolizer;
// export default  VectorStyleForm;
