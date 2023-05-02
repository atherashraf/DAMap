import * as React from "react";

import WaterQualitySurfaceTest from "./tests/WaterQualitySurfaceTest";
import NetworkDischargeTest from "./tests/NetworkDischargeTest";
import LayerDesigner from "./ol-map/containers/LayerDesigner";
import {BrowserRouter, createBrowserRouter, HashRouter, Route, Routes} from "react-router-dom";
import LayerInfo from "./admin/containers/LayerInfo";
import {
    createHashRouter,
    RouterProvider,
} from "react-router-dom";
import MapInfo from "./admin/containers/MapInfo";
import MapAdmin from "./admin/containers/MapAdmin";
import DAMap from "./ol-map/containers/DAMap";
import MapView from "./ol-map/containers/MapView";

const App = () => {
    return (
        // <RouterProvider router={router} />
        <BrowserRouter>
            <Routes>
                <Route path="/designer/:layerId/" element={<LayerDesigner/>}/>
                <Route path={"/LayerInfo"} element={<LayerInfo />} />
                <Route path={"/MapInfo"} element={<MapInfo />} />
                {/*<Route path={"/create_map"} element={<DAMap />} />*/}
                <Route path={"/ViewMap/:mapId/"} element={<DAMap />} />
                <Route path={"/"} element={<MapAdmin />} />

                {/*<Route path="/discharge" element={<NetworkDischargeTest uuid={"b4e1e9d2-cf70-11ed-9a9a-acde48001122"} isMap={props.isMap} isDesigner={props.isDesigner}/>}/>*/}
                {/*<Route path="/wq" element={ <WaterQualitySurfaceTest uuid={"4ef3ac02-4f2b-11ed-848b-acde48001122"} isMap={props.isMap} isDesigner={props.isDesigner}/>}/>*/}
            </Routes>
        </BrowserRouter>
    )
}

export default App
