import * as React from "react";
import DAColorPicker from "../../DAColorPicker";
import { IGeomStyle } from "../../../../TypeDeclaration";
import PointSymbolizer from "./PointSymbolizer";
interface IProp {
    geomType: string[];
    style?: IGeomStyle;
}
interface IState {
    strokeWidth: number;
    errorStrokeWidth: string;
    errorNoOfClasses: string;
    strokeColor: string;
    fillColor: string;
}
declare class VectorSymbolizer extends React.PureComponent<IProp, IState> {
    minStrokeWidth: number;
    maxStrokeWidth: number;
    strokeColorRef: React.RefObject<DAColorPicker>;
    fillColorRef: React.RefObject<DAColorPicker>;
    pointSymbolRef: React.RefObject<PointSymbolizer>;
    constructor(props: any);
    componentDidUpdate(prevProps: Readonly<IProp>, prevState: Readonly<IState>, snapshot?: any): void;
    getStyleParams(): IGeomStyle;
    validateForm(): boolean;
    validateStrokeWidth(val?: number): boolean;
    render(): JSX.Element;
}
export default VectorSymbolizer;
