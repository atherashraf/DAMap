import * as React from "react";
import MapVM from "../models/MapVM";
import {useEffect} from "react";
import LeftDrawer from "../components/drawers/LeftDrawer";
import RightDrawer from "../components/drawers/RightDrawer";

export const leftDrawerRef = React.createRef<LeftDrawer>();
export const rightDrawerRef = React.createRef<RightDrawer>();

const MapView = () => {
    const mapVM = new MapVM()
    mapVM.initMap();
    useEffect(() => {
        mapVM.setTarget('map');
    })
    return (
        <React.Fragment>
            <div style={{
                display: "flex",
                padding: "50px",
                width: "100%",
                boxSizing: "border-box",
                height: "100%"
            }}>
                <LeftDrawer ref={leftDrawerRef}/>
                <div id={"map"} style={{
                    width: "100%",
                    height: "100%"
                }}/>
                <RightDrawer ref={rightDrawerRef}/>

            </div>
        </React.Fragment>
    )
}

export default MapView;
