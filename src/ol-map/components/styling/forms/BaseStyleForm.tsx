import * as React from "react";
import {DAStyle} from "../../../utils/TypeDeclaration";

export interface BaseStyleFormProps{
    layerId: string
}

class BaseStyleForm extends React.PureComponent<BaseStyleFormProps, any>{
    getStyleParams(): DAStyle{
        return null
    }
    render(){
        return(
            <React.Fragment>
            </React.Fragment>
        )
    }
}

export default BaseStyleForm
