import * as React from "react"
import {useParams} from "react-router-dom";
import MapView from "./MapView";

interface IProps {
    isEditor?: boolean
}

const DAMap = (props: IProps) => {
    const {mapId} = useParams()
    return (
        <div style={{"width": "100%", height: "calc(100% - 30px)"}}>
            {props.isEditor ?
                <MapView uuid={mapId} isMap={true} isEditor={props.isEditor}/> :
                <MapView uuid={mapId} isMap={true}/>
            }
        </div>

    )
}

export default DAMap
