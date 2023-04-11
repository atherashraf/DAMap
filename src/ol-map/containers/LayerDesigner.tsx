import * as React from "react";
import MapView from "./MapView";
import {useParams} from "react-router-dom";


interface LayerDesignerProps {
    // layerId?: string
}

const LayerDesigner = () => {
    // const { layerId } = useParams();
    const layerId = "2378481c-cfe1-11ed-924d-367dda4cf16d"
    // const layerId = "6e0f2ab0-d53d-11ed-82a6-acde48001122"
    return (
        <React.Fragment>
            <MapView uuid={layerId} isMap={false} isDesigner={true}/>
        </React.Fragment>
    )
}

export default LayerDesigner
