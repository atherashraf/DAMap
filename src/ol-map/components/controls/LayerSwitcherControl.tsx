import * as React from "react";
import {IControlProps} from "../../utils/TypeDeclaration";
import "./LayerSwitcher.css";

const LayerSwitcherControl = (props: IControlProps) => {
    const {mapVM} = props
    React.useEffect(() => {
        const elem = document.getElementById('div-layer-switcher')
        mapVM.addLayerSwitcher(elem)
    }, [])
    return (
        <React.Fragment>
            <div id={"div-layer-switcher"} style={{width: "100%", height: "auto"}}/>
        </React.Fragment>
    )
}

export default LayerSwitcherControl
