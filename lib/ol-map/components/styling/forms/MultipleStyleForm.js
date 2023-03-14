import BaseStyleForm from "./BaseStyleForm";
import { Box, Button, FormControl, InputLabel, MenuItem, Table, TableBody, TableCell, TableContainer, TableRow } from "@mui/material";
import * as React from "react";
import { MapAPIs } from "../../../utils/MapApi";
import { DASelect } from "../../StyledMapComponent";
import PointSymbolizer from "./symbolizer/PointSymbolizer";
import { LegendIcons } from "../atoms/LegendIcons";
class MultipleStyleForm extends BaseStyleForm {
    constructor(props) {
        super(props);
        this.pointSymbolizerRef = React.createRef();
        this.state = {
            fields: [],
            fieldValues: [],
            selectedField: "",
            selectedValue: "",
            styleList: [{
                    title: "default",
                    style: this.getRandomStyle()
                }],
        };
    }
    componentDidMount() {
        var _a, _b, _c;
        const currentStyle = (_b = (_a = this.props.mapVM.getDALayer(this.props.layerId)) === null || _a === void 0 ? void 0 : _a.style) === null || _b === void 0 ? void 0 : _b.style;
        // console.log(currentStyle)
        if (currentStyle) {
            const styleList = [{ title: "default", style: currentStyle.default }];
            (_c = currentStyle.rules) === null || _c === void 0 ? void 0 : _c.forEach((rule) => {
                styleList.push(rule);
            });
            this.setState(() => ({ styleList: styleList }));
        }
        this.props.mapVM.getApi().get(MapAPIs.DCH_LAYER_FIELDS, { uuid: this.props.layerId })
            .then((payload) => {
            // console.log("fields", payload)
            this.setState({ fields: payload });
        });
    }
    getFeatureStyle() {
        // const style: DAGeomStyle = this.vectorStyleRef.current.getStyleParams()
        const defaultRule = this.state.styleList.filter((item) => item.title == "default");
        const rules = this.state.styleList.filter((item) => item.title != "default");
        return ({
            type: "multiple",
            style: {
                default: defaultRule[0].style,
                rules: rules
            }
        });
    }
    getFieldName(fieldInfo) {
        this.props.mapVM.getApi().get(MapAPIs.DCH_LAYER_FIELD_DISTINCT_VALUE, {
            uuid: this.props.layerId,
            field_name: fieldInfo.name, field_type: fieldInfo.d_type
        }).then((payload) => this.setState({ fieldValues: payload }));
    }
    getRandomStyle() {
        var _a, _b;
        const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
        return {
            pointShape: ((_a = this.pointSymbolizerRef.current) === null || _a === void 0 ? void 0 : _a.getPointSymbolizer().pointShape) || "circle",
            pointSize: ((_b = this.pointSymbolizerRef.current) === null || _b === void 0 ? void 0 : _b.getPointSymbolizer().pointSize) || 10,
            strokeColor: randomColor,
            strokeWidth: 3,
            fillColor: randomColor + "bf"
        };
    }
    updatePointParams(pointSymbolizer) {
        const styleList = this.state.styleList.map((rule) => {
            rule.style.pointShape = pointSymbolizer.pointShape;
            rule.style.pointSize = pointSymbolizer.pointSize;
            return rule;
        });
        this.setState({ styleList: styleList });
    }
    updateStyleItem(index, style) {
        const data = this.state.styleList.map((item, i) => i == index ?
            Object.assign(item, { style: style }) : item);
        this.setState(() => ({ styleList: data }));
    }
    AddStyleItem() {
        if (!this.state.selectedField) {
            this.props.mapVM.showSnackbar("Please select field");
        }
        else if (!this.state.selectedValue) {
            this.props.mapVM.showSnackbar("Please select value");
        }
        else {
            const index = this.state.styleList.findIndex((item) => {
                var _a, _b, _c;
                return ((_a = item.filter) === null || _a === void 0 ? void 0 : _a.field) == ((_b = this.state.selectedField) === null || _b === void 0 ? void 0 : _b.name) &&
                    ((_c = item.filter) === null || _c === void 0 ? void 0 : _c.value) == this.state.selectedValue;
            });
            if (index == -1) {
                const data = [...this.state.styleList, {
                        title: this.state.selectedValue,
                        filter: {
                            field: this.state.selectedField.name,
                            op: "==",
                            value: this.state.selectedValue,
                        },
                        style: this.getRandomStyle()
                    }];
                this.setState(() => ({ styleList: data }));
            }
            else {
                this.props.mapVM.showSnackbar("Value already added. Select other Value...");
            }
        }
    }
    AddAllStyleItem() {
        if (!this.state.selectedField) {
            this.props.mapVM.showSnackbar("Please select field");
        }
        else {
            const styleItems = [];
            this.state.fieldValues.forEach((value) => {
                styleItems.push({
                    title: value,
                    filter: {
                        field: this.state.selectedField.name,
                        op: "==",
                        value: value
                    },
                    style: this.getRandomStyle()
                });
            });
            styleItems.push({
                title: "default",
                style: this.getRandomStyle()
            });
            this.setState(() => ({ styleList: styleItems }));
        }
    }
    RemoveAllItems() {
        const defaultValue = this.state.styleList.filter((item) => item.title == "default");
        this.setState(() => ({ styleList: defaultValue }));
    }
    render() {
        const geomType = this.props.mapVM.getDALayer(this.props.layerId).getGeomType();
        return (React.createElement(React.Fragment, null,
            geomType.findIndex((a) => a.includes("Point")) != -1 &&
                React.createElement(PointSymbolizer, { ref: this.pointSymbolizerRef, pointSize: this.state.styleList[0].pointSize, pointShape: this.state.styleList[0].pointShape, updateStyle: this.updatePointParams.bind(this) }),
            React.createElement("fieldset", null,
                React.createElement("legend", null, "Select Field and Value"),
                React.createElement(Box, { sx: { flex: 1, pt: 1 } },
                    React.createElement(FormControl, { fullWidth: true, size: "small" },
                        React.createElement(InputLabel, { id: "select-field-label" }, "Select Field"),
                        React.createElement(DASelect, { labelId: "select-field-label", id: "select-field-select", value: this.state.selectedField.name, label: "Select Field", onChange: (e) => {
                                this.setState({ selectedField: e.target.value });
                                this.getFieldName(e.target.value);
                            } }, this.state.fields.map((field) => field.d_type === "string" &&
                            React.createElement(MenuItem, { key: `${field.name}-key`, value: field }, field.name))))),
                React.createElement(Box, { sx: { flex: 1, pt: 1 } },
                    React.createElement(FormControl, { fullWidth: true, size: "small" },
                        React.createElement(InputLabel, { id: "select-value-label" }, "Select Value"),
                        React.createElement(DASelect, { labelId: "select-value-label", id: "select-value-select", value: this.state.selectedValue, label: "Select Value", onChange: (e) => {
                                // @ts-ignore
                                this.setState({ selectedValue: e.target.value });
                            } }, this.state.fieldValues.map((value) => React.createElement(MenuItem, { key: `${value}-key`, value: value }, value))))),
                React.createElement(Box, { sx: { flex: 1, pt: 1 } },
                    React.createElement(Button, { onClick: this.AddStyleItem.bind(this), fullWidth: true, color: "success", variant: "contained" }, "Add Value")),
                React.createElement(Box, { sx: { flex: 1, pt: 1 } },
                    React.createElement(Button, { onClick: this.AddAllStyleItem.bind(this), fullWidth: true, color: "primary", variant: "contained" }, "Add All Value")),
                React.createElement(Box, { sx: { flex: 1, pt: 1 } },
                    React.createElement(Button, { onClick: this.RemoveAllItems.bind(this), fullWidth: true, color: "error", variant: "contained" }, "Clear"))),
            this.state.styleList.length > 0 &&
                React.createElement("fieldset", null,
                    React.createElement("legend", null, "Symbology Grid"),
                    React.createElement(TableContainer, { style: { maxHeight: 200 } },
                        React.createElement(Table, { size: "medium", padding: "none" },
                            React.createElement(TableBody, null, this.state.styleList.map((item, index) => React.createElement(TableRow, null,
                                React.createElement(TableCell, null, item.title),
                                React.createElement(TableCell, null,
                                    React.createElement(LegendIcons, { mapVM: this.props.mapVM, updateStyle: this.updateStyleItem.bind(this), index: index, geomType: geomType, style: item.style }))))))))));
    }
}
export default MultipleStyleForm;
