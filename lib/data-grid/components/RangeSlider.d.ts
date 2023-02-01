/// <reference types="react" />
interface IProps {
    min: number;
    max: number;
    handleValueChange: Function;
}
declare const RangeSlider: (props: IProps) => JSX.Element;
export default RangeSlider;
