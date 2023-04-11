import * as React from "react";
import MapView from "../ol-map/containers/MapView";
import {useEffect} from "react";

const MapViewRef = React.createRef<MapView>();
interface  IProps{
    uuid: string
    isMap: boolean
    isDesigner: boolean
}
const NetworkDischargeTest = (props: IProps) => {

    const changeDate =() =>{
        const mapVM = MapViewRef.current?.getMapVM();
        const daLayer = mapVM.getDALayer("2378481c-cfe1-11ed-924d-367dda4cf16d");
        if(daLayer) {
            daLayer.setAdditionalUrlParams("date=2023-03-15")
            daLayer.refreshLayer()
        }
    }
    return (
        <React.Fragment>
            <MapView ref={MapViewRef} uuid={props.uuid} isMap={props.isMap} isDesigner={props.isDesigner}/>
            <button onClick={changeDate}>Change Date</button>
        </React.Fragment>
    )
}

export default NetworkDischargeTest
