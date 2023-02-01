/// <reference types="react" />
import BaseStyleForm, { BaseStyleFormProps } from "./BaseStyleForm";
import { IFeatureStyle, IGeomStyle, IRule } from "../../../TypeDeclaration";
import { IPointSymbolizerState } from "./symbolizer/PointSymbolizer";
interface IProps extends BaseStyleFormProps {
}
interface FieldInfo {
    name: string;
    d_type: string;
}
interface IState {
    fields: FieldInfo[];
    fieldValues: string[];
    selectedField: FieldInfo;
    selectedValue: string;
    styleList: IRule[];
}
declare class MultipleStyleForm extends BaseStyleForm<IProps, IState> {
    private pointSymbolizerRef;
    constructor(props: BaseStyleFormProps);
    componentDidMount(): void;
    getFeatureStyle(): IFeatureStyle;
    getFieldName(fieldInfo: any): void;
    getRandomStyle(): IGeomStyle;
    updatePointParams(pointSymbolizer: IPointSymbolizerState): void;
    updateStyleItem(index: number, style: IGeomStyle): void;
    AddStyleItem(): void;
    AddAllStyleItem(): void;
    RemoveAllItems(): void;
    render(): JSX.Element;
}
export default MultipleStyleForm;
