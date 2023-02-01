import * as React from "react";
import { Style } from "ol/style";
import { IGeomStyle } from "../../../../TypeDeclaration";
export declare const pointShapeTypes: readonly ["circle", "star", "triangle", "square"];
export declare const getPointSVG: (style: IGeomStyle, w?: number, h?: number) => JSX.Element;
export declare const getPointShapes: (style: IGeomStyle) => Style;
interface IProps {
    updateStyle?: Function;
    pointShape: typeof pointShapeTypes[number];
    pointSize: number;
}
export interface IPointSymbolizerState {
    pointShape: typeof pointShapeTypes[number];
    pointSize: number;
}
declare class PointSymbolizer extends React.PureComponent<IProps, IPointSymbolizerState> {
    constructor(props: IProps);
    componentDidUpdate(prevProps: Readonly<IProps>, prevState: Readonly<IPointSymbolizerState>, snapshot?: any): void;
    getPointSymbolizer(): {
        pointShape: "square" | "triangle" | "circle" | "star";
        pointSize: number;
    };
    render(): JSX.Element;
}
export default PointSymbolizer;
