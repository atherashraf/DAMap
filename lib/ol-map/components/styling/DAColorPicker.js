import * as React from "react";
import { SliderPicker } from "react-color";
import Alpha from "react-color/lib/components/alpha/Alpha";
import autoBind from "auto-bind";
class DAColorPicker extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            color: this.props.color
        };
        autoBind(this);
    }
    handleColorChange(color) {
        var _a, _b;
        let hexColor = color.hex;
        if (((_a = this.props) === null || _a === void 0 ? void 0 : _a.isAlpha) && color.rgb && ((_b = color === null || color === void 0 ? void 0 : color.rgb) === null || _b === void 0 ? void 0 : _b.a) > 0.08) {
            hexColor = color.hex + (parseInt(String(color.rgb.a * 255))).toString(16);
        }
        this.setState({ color: hexColor });
        this.props.onChange(hexColor);
    }
    getColor() {
        return this.state.color;
    }
    render() {
        return (React.createElement("fieldset", null,
            this.props.label && React.createElement("legend", null, this.props.label),
            React.createElement(SliderPicker, { color: this.state.color, onChange: this.handleColorChange }),
            this.props.isAlpha &&
                React.createElement(React.Fragment, null,
                    React.createElement("br", null),
                    React.createElement(Alpha, { width: "100%", color: this.state.color, onChange: this.handleColorChange }))));
    }
}
export default DAColorPicker;
