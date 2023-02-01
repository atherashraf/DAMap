import * as React from "react";
import { ColorResult } from "react-color";
interface CustomColorPickerProps {
    label?: string;
    color: string;
    isAlpha: boolean;
    onChange?: Function;
}
interface CustomColorPickerState {
    color: string;
}
declare class DAColorPicker extends React.PureComponent<CustomColorPickerProps, CustomColorPickerState> {
    state: {
        color: string;
    };
    constructor(props: CustomColorPickerProps);
    handleColorChange(color: ColorResult): void;
    getColor(): string;
    render(): JSX.Element;
}
export default DAColorPicker;
