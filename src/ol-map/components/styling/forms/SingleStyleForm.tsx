import autoBind from "auto-bind";
import React, {PureComponent} from "react";
import {DAFeatureStyle, DAGeomStyle, ILayerInfo} from "../../../utils/TypeDeclaration";
import VectorStyleForm from "./VectorStyleForm";
import BaseStyleForm, {BaseStyleFormProps} from "./BaseStyleForm";



class SingleStyleForm extends BaseStyleForm{
    vectorStyleRef = React.createRef<VectorStyleForm>();
    constructor (props: BaseStyleFormProps) {
        super(props);
        autoBind(this);
    }
    getStyleParams () :DAFeatureStyle {
        const style: DAGeomStyle = this.vectorStyleRef.current.getStyleParams()
        if(style) {
            const params: DAFeatureStyle = {
                type: "single",
                style:{
                    default: style
                }
            };
            return params
        }
        return null;
    }

    render () {
        // const{vector_type} = this.props?.layerInfo;
        return (
            <React.Fragment>
                <VectorStyleForm ref={this.vectorStyleRef} />
            </React.Fragment>
        );
    }
}

export default SingleStyleForm;
