import * as React from "react"
import MapVM from "../models/MapVM";
import "./LayerSwitcher.css";
interface LayerSwitcherProps {
    mapVM: MapVM
}

const LayerSwitcher = (props: LayerSwitcherProps) => {
    const {mapVM} = props
    React.useEffect(() => {
        const elem = document.getElementById('div-layer-switcher') as HTMLElement
        mapVM.addLayerSwitcher(elem)
    }, [])
    return (
        <React.Fragment>
            <div id={"div-layer-switcher"} style={{width: "100%", height: "auto"}}/>
        </React.Fragment>
    )
}

export default LayerSwitcher
