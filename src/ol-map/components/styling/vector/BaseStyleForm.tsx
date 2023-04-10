import * as React from "react";
import {IFeatureStyle} from "../../../TypeDeclaration";
import MapVM from "../../../models/MapVM";

export interface BaseStyleFormProps {
    layerId: string
    mapVM: MapVM
}

class BaseStyleForm<P = {}, S = {}, SS = any> extends React.PureComponent<BaseStyleFormProps, any> {
    getFeatureStyle(): IFeatureStyle {
        return null
    }

    render() {
        return (
            <React.Fragment>
            </React.Fragment>
        )
    }
}

export default BaseStyleForm


