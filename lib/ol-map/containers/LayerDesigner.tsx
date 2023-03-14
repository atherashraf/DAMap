import * as React from "react";
import MapView from "./MapView";


interface LayerDesignerProps {
    layerId: string
}

const LayerDesigner = (props: LayerDesignerProps) => {
    return (
        <React.Fragment>
            <MapView uuid={props.layerId} isMap={false} isDesigner={true}/>
        </React.Fragment>
    )
}

export default LayerDesigner
