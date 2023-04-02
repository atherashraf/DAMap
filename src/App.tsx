import * as React from "react";
import MapView from "./ol-map/containers/MapView";
import WaterQualitySurfaceTest from "./tests/WaterQualitySurfaceTest";
import NetworkDischargeTest from "./tests/NetworkDischargeTest";
import {useEffect} from "react";



const App = (props) => {

    return (
        <React.Fragment>
            {/*<WaterQualitySurfaceTest uuid={"4ef3ac02-4f2b-11ed-848b-acde48001122"} isMap={props.isMap} isDesigner={props.isDesigner}/>*/}
            <NetworkDischargeTest uuid={"b4e1e9d2-cf70-11ed-9a9a-acde48001122"} isMap={props.isMap} isDesigner={props.isDesigner}/>
        </React.Fragment>
    )
}

export default App
