import * as React from "react";
import MapVM from "./ol-map/MapVM";
import {useEffect} from "react";
import SideDrawer from "./ol-map/components/SideDrawer";

const App = () => {
    const mapVM = new MapVM()
    mapVM.initMap();
    useEffect(() => {
        mapVM.setTarget('map');
    })


    return (
        <React.Fragment>
            <div id="map" style={{width: "100%", height: "100%"}}/>
            <SideDrawer />
        </React.Fragment>
    );
}
export default App;
