import * as React from "react";
import { IBaseMapProps } from "../../../TypeDeclaration";
interface IProps extends IBaseMapProps {
}
declare class IState {
    backgroundColor: string;
    colors: string[];
}
declare class ColorRamp extends React.PureComponent<IProps, IState> {
    constructor(props: IProps);
    componentDidMount(): void;
    getColors(): string[];
    createColorRamp(): void;
    addColor(): Promise<void>;
    handleColorChange(index: number, color: string): void;
    getDialogContent(): JSX.Element;
    handleClick(): void;
    render(): JSX.Element;
}
export default ColorRamp;
