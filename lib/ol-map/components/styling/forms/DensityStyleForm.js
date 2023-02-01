import BaseStyleForm from "./BaseStyleForm";
import { Box, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import * as React from "react";
import { MapAPIs } from "../../../utils/MapApi";
import PointSymbolizer from "./symbolizer/PointSymbolizer";
import LegendGrid from "../atoms/LegendGrid";
import AddStyleButton from "../atoms/AddStyleButton";
import ColorRamp from "../atoms/ColorRamp";
import _ from "../../../utils/lodash";
class DensityStyleForm extends BaseStyleForm {
    constructor(props) {
        super(props);
        this.pointSymbolizerRef = React.createRef();
        this.colorRampRef = React.createRef();
        this.state = {
            fields: [],
            fieldValues: [],
            selectedField: "",
            noOfClasses: 4,
            styleList: [{ title: "default", style: this.getGeomStyle() }]
        };
    }
    componentDidMount() {
        var _a, _b, _c;
        const currentStyle = (_b = (_a = this.props.mapVM.getDALayer(this.props.layerId)) === null || _a === void 0 ? void 0 : _a.style) === null || _b === void 0 ? void 0 : _b.style;
        // console.log(currentStyle)
        if (currentStyle) {
            // const styleList = [{title: "default", style: currentStyle.default}]
            const styleList = [];
            (_c = currentStyle.rules) === null || _c === void 0 ? void 0 : _c.forEach((rule) => {
                styleList.push(rule);
            });
            this.setState(() => ({ styleList: styleList }));
        }
        this.props.mapVM.getApi().get(MapAPIs.DCH_LAYER_FIELDS, { uuid: this.props.layerId })
            .then((payload) => {
            this.setState({ fields: payload });
        });
    }
    removeStyles() {
        this.setState({ styleList: [] });
    }
    addStyles() {
        const { selectedField, selectedMethod, noOfClasses } = this.state;
        if (!selectedField) {
            this.props.mapVM.showSnackbar("Please select field first...");
        }
        else if (!selectedMethod) {
            this.props.mapVM.showSnackbar("Please select classification method...");
        }
        else {
            this.props.mapVM.getApi().get(MapAPIs.DCH_LAYER_FIELD_DISTINCT_VALUE, {
                uuid: this.props.layerId,
                field_name: selectedField.name,
                field_type: selectedField.d_type,
                classification: selectedMethod,
                no_of_classes: noOfClasses
            })
                .then((payload) => {
                this.setState({ fieldValues: payload });
                if (payload) {
                    const styleList = [];
                    // const valueCount = payload.length
                    payload.forEach((item, index) => {
                        if (index != 0) {
                            const title = `${Math.round(payload[index - 1])} - ${Math.round(item)}`;
                            const filter = {
                                field: this.state.selectedField.name,
                                op: "between",
                                value: [payload[index - 1], item]
                            };
                            const rule = {
                                title: title,
                                filter: filter,
                                style: this.getGeomStyle(index - 1)
                            };
                            styleList.push(rule);
                        }
                    });
                    this.setState({ "styleList": styleList });
                }
            });
        }
    }
    getFeatureStyle() {
        // const style: DAGeomStyle = this.vectorStyleRef.current.getStyleParams()
        // const defaultRule: IRule[] = this.state.styleList.filter((item: IRule) => item.title == "default") || []
        const rules = this.state.styleList.filter((item) => item.title != "default");
        return ({
            type: "density",
            style: {
                rules: rules
            }
        });
    }
    updatePointParams(pointSymbolizer) {
        const styleList = this.state.styleList.map((rule) => {
            rule.style.pointShape = pointSymbolizer.pointShape;
            rule.style.pointSize = pointSymbolizer.pointSize;
            return rule;
        });
        this.setState({ styleList: styleList });
    }
    getColor(valueIndex = -1) {
        if (valueIndex == -1) {
            return _.randomColor();
        }
        else {
            // const valueNormalizedIndex = valueIndex / (this.state.noOfClasses - 1);
            const colors = this.colorRampRef.current.getColors();
            // console.log("colors", colors)
            const index = valueIndex / (this.state.noOfClasses - 1) * (colors.length - 1);
            const mod = index % (colors.length - 1);
            // console.log("normalized values", valueNormalizedIndex, mod)
            let c;
            if (mod == 0) {
                c = colors[index];
                console.log("color", {
                    "value Index": valueIndex,
                    "color index": index, "c": c
                });
            }
            else {
                const f = Math.floor(index);
                const x1 = f / (colors.length - 1) * (this.state.noOfClasses - 1);
                const x2 = (f + 1) / (colors.length - 1) * (this.state.noOfClasses - 1);
                const rgba1 = _.hex2rgba(colors[f]);
                const rgba2 = _.hex2rgba(colors[f + 1]);
                const r = Math.round(_.linearInterpolation(valueIndex, [x1, rgba1.r], [x2, rgba2.r])).toString(16);
                const g = Math.round(_.linearInterpolation(valueIndex, [x1, rgba1.g], [x2, rgba2.g])).toString(16);
                const b = Math.round(_.linearInterpolation(valueIndex, [x1, rgba1.b], [x2, rgba2.b])).toString(16);
                const a = Math.round(_.linearInterpolation(valueIndex, [x1, rgba1.a], [x2, rgba2.a])).toString(16);
                c = `#${r}${g}${b}${a}`;
                console.log("color", {
                    "value Index": valueIndex, "color index": index,
                    "x1": x1, "x2": x2, "y1": f, "y2": f + 1,
                    "c": c, "c1": colors[f], "c2": colors[f + 1]
                });
            }
            return c;
        }
    }
    getGeomStyle(valueIndex = -1) {
        var _a, _b;
        const color = this.getColor(valueIndex);
        return {
            pointShape: ((_a = this.pointSymbolizerRef.current) === null || _a === void 0 ? void 0 : _a.getPointSymbolizer().pointShape) || "circle",
            pointSize: ((_b = this.pointSymbolizerRef.current) === null || _b === void 0 ? void 0 : _b.getPointSymbolizer().pointSize) || 10,
            strokeColor: color,
            strokeWidth: 3,
            fillColor: color
        };
    }
    updateStyleItem(index, style) {
        const data = this.state.styleList.map((item, i) => i == index ?
            Object.assign(item, { style: style }) : item);
        this.setState(() => ({ styleList: data }));
    }
    render() {
        const geomType = this.props.mapVM.getDALayer(this.props.layerId).getGeomType();
        const classificationMethods = [["Natural Break", "NaturalBreak"],
            ["Quantile", "Quantile"], ["Equal Interval", "EqualInterval"]];
        return (React.createElement(React.Fragment, null,
            geomType.findIndex((a) => a.includes("Point")) != -1 &&
                React.createElement(PointSymbolizer, { ref: this.pointSymbolizerRef, pointSize: this.state.styleList.length > 0 ? this.state.styleList[0].pointSize : "circle", pointShape: this.state.styleList.length > 0 ? this.state.styleList[0].pointShape : 18, updateStyle: this.updatePointParams.bind(this) }),
            React.createElement("fieldset", null,
                React.createElement("legend", null, "Classification"),
                React.createElement(Box, { sx: { flex: 1, p: 1 } },
                    React.createElement(FormControl, { fullWidth: true, size: "small" },
                        React.createElement(InputLabel, { id: "select-field-label" }, "Select Field"),
                        React.createElement(Select, { value: this.state.selectedField.name, label: "Select Field", onChange: (e) => {
                                this.setState({ selectedField: e.target.value });
                            } }, this.state.fields.map((field) => field.d_type === "number" &&
                            React.createElement(MenuItem, { key: `${field.name} - key`, value: field }, field.name)))),
                    React.createElement(Box, { sx: { flex: 1, pt: 1 } },
                        React.createElement(FormControl, { fullWidth: true, size: "small" },
                            React.createElement(TextField, { type: "number", value: this.state.noOfClasses, label: "No of Classes", size: "small", onChange: (e) => this.setState({ noOfClasses: parseInt(e.target.value) }), InputProps: { inputProps: { min: 2, max: 10 } } }))),
                    React.createElement(Box, { sx: { flex: 1, pt: 1 } },
                        React.createElement(FormControl, { fullWidth: true, size: "small" },
                            React.createElement(InputLabel, { id: "select-value-label" }, "Select Method"),
                            React.createElement(Select, { value: this.state.selectedMethod, label: "Select Method", onChange: (e) => {
                                    this.setState({ selectedMethod: e.target.value });
                                } }, classificationMethods.map((method) => React.createElement(MenuItem, { key: `${method} - key`, value: method[1] }, method[0]))))),
                    React.createElement(Box, { sx: { flex: 1, pt: 1, alignItems: "center" } },
                        React.createElement(ColorRamp, { ref: this.colorRampRef, mapVM: this.props.mapVM })),
                    React.createElement(Box, { sx: { flex: 1, pt: 1, alignItems: "center" } },
                        React.createElement(AddStyleButton, { menuList: [{
                                    name: "Add Style",
                                    handleClick: this.addStyles.bind(this)
                                }, {
                                    name: "Remove Styles",
                                    handleClick: this.removeStyles.bind(this)
                                }] })))),
            this.state.styleList.length > 0 &&
                React.createElement(LegendGrid, { styleList: this.state.styleList, updateStyleItem: this.updateStyleItem, mapVM: this.props.mapVM, layerId: this.props.layerId })));
    }
}
export default DensityStyleForm;
