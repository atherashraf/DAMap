import * as React from "react";
import { Slider } from "@mui/material";
const RangeSlider = (props) => {
    const [value, setValue] = React.useState([props.min, props.max]);
    const handleChange = (event, newValue) => {
        setValue(newValue);
        props.handleValueChange(newValue);
    };
    return (React.createElement(React.Fragment, null,
        React.createElement(Slider, { getAriaLabel: () => 'Temperature range', value: value, onChange: handleChange, valueLabelDisplay: "on", min: props.min, max: props.max, color: "secondary" })));
};
export default RangeSlider;
