import * as React from "react"
import {Slider} from "@mui/material";

interface IProps {
    min: number
    max: number
    handleValueChange: Function
}

const RangeSlider = (props: IProps) => {
    const [value, setValue] = React.useState<number[]>([props.min, props.max]);

    const handleChange = (event: Event, newValue: number | number[]) => {
        setValue(newValue as number[]);
        props.handleValueChange(newValue)
    };
    return (
        <React.Fragment>
            <Slider
                getAriaLabel={() => 'Temperature range'}
                value={value}
                onChange={handleChange}
                valueLabelDisplay="on"
                min={props.min}
                max={props.max}
                color={"secondary"}
                // getAriaValueText={valuetext}
            />
        </React.Fragment>
    )
}
export default RangeSlider
