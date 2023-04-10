import * as React from "react";

import WaterQualitySurfaceTest from "./tests/WaterQualitySurfaceTest";
import NetworkDischargeTest from "./tests/NetworkDischargeTest";
import LayerDesigner from "./ol-map/containers/LayerDesigner";
import {BrowserRouter, Route, Routes} from "react-router-dom";


const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LayerDesigner/>}/>
                {/*<Route path="/discharge" element={<NetworkDischargeTest uuid={"b4e1e9d2-cf70-11ed-9a9a-acde48001122"} isMap={props.isMap} isDesigner={props.isDesigner}/>}/>*/}
                {/*<Route path="/wq" element={ <WaterQualitySurfaceTest uuid={"4ef3ac02-4f2b-11ed-848b-acde48001122"} isMap={props.isMap} isDesigner={props.isDesigner}/>}/>*/}
            </Routes>
        </BrowserRouter>
    )
}

export default App
