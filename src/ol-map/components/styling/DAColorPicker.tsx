import * as React from "react";
import {ColorResult, SliderPicker} from "react-color";
import Alpha from "react-color/lib/components/alpha/Alpha";
import autoBind from "auto-bind";


interface CustomColorPickerProps {
    label?: string,
    color: string,
    isAlpha: boolean,
    onChange?: Function
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
        let hexColor = color.hex
        if (this.props?.isAlpha && color.rgb && color?.rgb?.a > 0.08) {
            hexColor = color.hex + (parseInt(String(color.rgb.a * 255))).toString(16);
        }
        this.setState({color: hexColor});
        if(typeof this.props.onChange !== "undefined")
            this.props.onChange(hexColor)

    }

    getColor() {
        return this.state.color;
    }

    render() {
        return (
            <fieldset>
                {this.props.label && <legend>{this.props.label}</legend>}

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
