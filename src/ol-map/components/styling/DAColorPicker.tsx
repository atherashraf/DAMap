import {ColorResult, SliderPicker} from "react-color";
import Alpha from "react-color/lib/components/alpha/Alpha";

import React from "react";
import autoBind from "auto-bind";


interface CustomColorPickerProps {
    label: string,
    color: string,
    isAlpha: boolean
}

interface CustomColorPickerState {
    color: string,
}

class DAColorPicker extends React.PureComponent<CustomColorPickerProps, CustomColorPickerState> {
    state = {
        color: this.props.color
    }

    constructor(props: CustomColorPickerProps) {
        super(props);
        autoBind(this);
    }

    handleColorChange(color: ColorResult) {
        if (this.props.isAlpha && color.rgb.a > 0.08) {
            const hexColor = color.hex + (parseInt(String(color.rgb.a * 255))).toString(16);
            // console.log("color", color, hexColor);
            this.setState({color: hexColor});
        } else
            this.setState({color: color.hex});


    }

    getColor() {
        return this.state.color;
    }

    render() {
        return (
            <fieldset>
                <legend>{this.props.label}</legend>

                <SliderPicker
                    color={this.state.color}
                    onChange={this.handleColorChange}
                />


                {this.props.isAlpha &&
                    <>
                        <br/>
                        <Alpha
                            width={"100%"} color={this.state.color} onChange={this.handleColorChange}/>
                    </>
                }

                {/*<AlphaPicker width="100px" onChange={handleColorChange} color={this.state.fillColor}  />*/}
            </fieldset>

        );
    }
}

export default DAColorPicker;
