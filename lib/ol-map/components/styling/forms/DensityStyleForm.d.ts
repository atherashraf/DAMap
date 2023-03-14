/// <reference types="react" />
import BaseStyleForm, { BaseStyleFormProps } from "./BaseStyleForm";
import { IPointSymbolizerState } from "./symbolizer/PointSymbolizer";
import { IFeatureStyle, IGeomStyle, IRule } from "../../../TypeDeclaration";
interface FieldInfo {
    name: string;
    d_type: string;
}
interface IProps {
}
interface IState {
    fields: FieldInfo[];
    selectedField: FieldInfo;
    selectedMethod: string;
    noOfClasses: number;
    styleList: IRule[];
}
declare class DensityStyleForm extends BaseStyleForm<IProps, IState> {
    private pointSymbolizerRef;
    private colorRampRef;
    constructor(props: BaseStyleFormProps);
    componentDidMount(): void;
    removeStyles(): void;
    addStyles(): void;
    getFeatureStyle(): IFeatureStyle;
    updatePointParams(pointSymbolizer: IPointSymbolizerState): void;
    getColor(valueIndex?: number): string;
    getGeomStyle(valueIndex?: number): IGeomStyle;
    updateStyleItem(index: number, style: IGeomStyle): void;
    render(): JSX.Element;
}
export default DensityStyleForm;
