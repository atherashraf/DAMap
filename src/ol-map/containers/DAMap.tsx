import * as React from "react"
import {useParams} from "react-router-dom";
import MapView from "./MapView";

const DAMap=()=>{
    const {mapId} = useParams()

    return(
        <React.Fragment>
           <MapView uuid={mapId} isMap={true} />
        </React.Fragment>
    )
}

export default DAMap
