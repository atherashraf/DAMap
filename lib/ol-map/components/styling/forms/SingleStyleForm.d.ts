import { IFeatureStyle } from "../../../TypeDeclaration";
import BaseStyleForm, { BaseStyleFormProps } from "./BaseStyleForm";
import VectorSymbolizer from "./symbolizer/VectorSymbolizer";
import * as React from "react";
declare class SingleStyleForm extends BaseStyleForm {
    vectorStyleRef: React.RefObject<VectorSymbolizer>;
    constructor(props: BaseStyleFormProps);
    getFeatureStyle(): IFeatureStyle;
    render(): JSX.Element;
}
export default SingleStyleForm;
