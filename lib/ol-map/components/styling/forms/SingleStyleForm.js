import autoBind from "auto-bind";
import BaseStyleForm from "./BaseStyleForm";
import VectorSymbolizer from "./symbolizer/VectorSymbolizer";
import * as React from "react";
class SingleStyleForm extends BaseStyleForm {
    constructor(props) {
        super(props);
        this.vectorStyleRef = React.createRef();
        autoBind(this);
    }
    getFeatureStyle() {
        const style = this.vectorStyleRef.current.getStyleParams();
        if (style) {
            return {
                type: "single",
                style: {
                    default: style
                }
            };
        }
        return null;
    }
    render() {
        const geomType = this.props.mapVM.getDALayer(this.props.layerId).getGeomType();
        return (React.createElement(React.Fragment, null,
            React.createElement(VectorSymbolizer, { ref: this.vectorStyleRef, geomType: geomType })));
    }
}
export default SingleStyleForm;
