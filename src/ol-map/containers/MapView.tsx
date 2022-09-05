import * as React from "react";
import MapVM from "../models/MapVM";
import {useEffect} from "react";
import LeftDrawer from "../components/drawers/LeftDrawer";
import RightDrawer from "../components/drawers/RightDrawer";

export const leftDrawerRef = React.createRef<LeftDrawer>();
export const rightDrawerRef = React.createRef<RightDrawer>();

interface MapVMProps {
    height?: number
}

const MapView = (props: MapVMProps) => {
    const mapVM = new MapVM()
    useEffect(() => {
        if (!mapVM.isInit) {

            mapVM.initMap(rightDrawerRef, leftDrawerRef);
        }
        mapVM.setTarget('map');
    }, [])
    return (
        <React.Fragment>
            <div style={{
                display: "flex",
                // padding: "50px",
                width: "100%",
                boxSizing: "border-box",
                height: "100%"
            }}>
                <LeftDrawer ref={leftDrawerRef}/>
                <div id={"map"} style={{
                    width: "100%",
                    height: props.height ? props.height : "100%"
                }}/>
                <RightDrawer ref={rightDrawerRef}/>

            </div>
        </React.Fragment>
    )
}

export default MapView;
