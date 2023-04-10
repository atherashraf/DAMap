import autoBind from "auto-bind";
import {IFeatureStyle, IGeomStyle} from "../../../TypeDeclaration";

import BaseStyleForm, {BaseStyleFormProps} from "./BaseStyleForm";
import VectorSymbolizer from "./symbolizer/VectorSymbolizer";
import * as React from "react";


class SingleStyleForm extends BaseStyleForm {
    vectorStyleRef = React.createRef<VectorSymbolizer>();

    constructor(props: BaseStyleFormProps) {
        super(props);
        autoBind(this);
    }

    getFeatureStyle(): IFeatureStyle {
        const style: IGeomStyle = this.vectorStyleRef.current.getStyleParams()
        if (style) {
            return  {
                type: "single",
                style: {
                    default: style
                }
            };
        }
        return null;
    }

    render() {
        const geomType = this.props.mapVM.getDALayer(this.props.layerId).getGeomType()
        return (
            <React.Fragment>
                <VectorSymbolizer ref={this.vectorStyleRef} geomType={geomType}/>
            </React.Fragment>
        );
    }
}

export default SingleStyleForm;
