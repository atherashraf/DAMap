import * as React from "react";
import { IFeatureStyle } from "../../../TypeDeclaration";
import MapVM from "../../../models/MapVM";
export interface BaseStyleFormProps {
    layerId: string;
    mapVM: MapVM;
}
declare class BaseStyleForm<P = {}, S = {}, SS = any> extends React.PureComponent<BaseStyleFormProps, any> {
    getFeatureStyle(): IFeatureStyle;
    render(): JSX.Element;
}
export default BaseStyleForm;
