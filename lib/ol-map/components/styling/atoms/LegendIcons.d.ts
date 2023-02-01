/// <reference types="react" />
import MapVM from "../../../models/MapVM";
import { IGeomStyle } from "../../../TypeDeclaration";
interface SymbologyIconProps {
    mapVM: MapVM;
    style: IGeomStyle;
    updateStyle: Function;
    index: number;
    geomType: string[];
}
export declare const LegendIcons: (props: SymbologyIconProps) => JSX.Element;
export {};
