var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as React from "react";
import Button from "@mui/material/Button";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Box, IconButton } from "@mui/material";
import DAColorPicker from "../DAColorPicker";
import _ from "../../../utils/lodash";
class IState {
}
class ColorRamp extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            backgroundColor: "linear-gradient(to right, white 0%, darkblue 100%)",
            // colors: ["#e9e9ea", "#040471"],
            colors: [
                "#701d1d",
                "#dcdf95",
                "#094018"
            ]
        };
    }
    componentDidMount() {
        this.createColorRamp();
    }
    getColors() {
        return [...this.state.colors];
    }
    createColorRamp() {
        var _a;
        // colors = colors ? colors : this.state.colors;
        const { colors } = this.state;
        let backgroundColor = "linear-gradient(to right";
        const totalColors = this.state.colors.length;
        colors.forEach((c, index) => {
            const percent = index / (totalColors - 1) * 100;
            backgroundColor += `, ${c} ${percent}%`;
        });
        backgroundColor += ")";
        this.setState(() => ({ backgroundColor: backgroundColor }));
        (_a = this.props.mapVM.getDialogBoxRef().current) === null || _a === void 0 ? void 0 : _a.closeDialog();
    }
    addColor() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const newColor = _.randomColor();
            yield this.setState(() => ({ colors: [...this.state.colors, newColor] }));
            (_a = this.props.mapVM.getDialogBoxRef().current) === null || _a === void 0 ? void 0 : _a.updateContents(this.getDialogContent());
        });
    }
    handleColorChange(index, color) {
        const colors = [...this.state.colors];
        colors[index] = color;
        this.setState(() => ({ colors: colors }));
    }
    getDialogContent() {
        return (React.createElement(React.Fragment, null,
            React.createElement(Box, { sx: { flex: 1, p: 2, overflowY: "auto", width: 300 } }, this.state.colors.map((c, index) => React.createElement(DAColorPicker, { key: "color-" + index, onChange: (color) => this.handleColorChange(index, color), label: "Color " + index, color: c, isAlpha: true })))));
    }
    handleClick() {
        var _a, _b;
        const dialogRef = this.props.mapVM.getDialogBoxRef();
        (_a = dialogRef.current) === null || _a === void 0 ? void 0 : _a.openDialog({
            title: "Create Color Ramp",
            content: this.getDialogContent(),
            actions: React.createElement(React.Fragment, null,
                React.createElement(Button, { key: "add-color", onClick: this.addColor.bind(this) }, "Add Color"),
                React.createElement(Button, { key: "create-ramp", onClick: this.createColorRamp.bind(this) }, "Create "),
                React.createElement(Button, { key: "close-ramp", onClick: (_b = dialogRef.current) === null || _b === void 0 ? void 0 : _b.closeDialog }, "Close "))
        });
    }
    render() {
        return (React.createElement(React.Fragment, null,
            React.createElement("div", { style: { display: "flex", alignItems: "center" } },
                React.createElement(Box
                // onClick={handleClick}
                // endIcon={<KeyboardArrowDownIcon/>}
                // color={"secondary"}
                // fullWidth={true}
                , { 
                    // onClick={handleClick}
                    // endIcon={<KeyboardArrowDownIcon/>}
                    // color={"secondary"}
                    // fullWidth={true}
                    style: {
                        background: this.state.backgroundColor,
                        width: "85%", height: "30px"
                    } }),
                React.createElement(IconButton, { style: { width: "15%", height: 30 }, onClick: this.handleClick.bind(this) },
                    React.createElement(KeyboardArrowDownIcon, null)))));
    }
}
export default ColorRamp;
