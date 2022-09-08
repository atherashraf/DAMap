import * as React from "react";
import MapVM from "../models/MapVM";
import {useEffect} from "react";
import LeftDrawer from "../components/drawers/LeftDrawer";
import RightDrawer from "../components/drawers/RightDrawer";
import Api, {APIs} from "../../Api";
import {DAFeatureStyle, IMapInfo} from "../utils/TypeDeclaration";

export const leftDrawerRef = React.createRef<LeftDrawer>();
export const rightDrawerRef = React.createRef<RightDrawer>();

interface MapVMProps {
    height?: number,
    uuid: string
}

const MapView = (props: MapVMProps) => {
    const mapVM = new MapVM()
    useEffect(() => {
        const {uuid} = props
        if (uuid) {
            Api.get(APIs.DCH_MAP_INFO, {"uuid": props.uuid})
                .then((payload: IMapInfo) => {
                    console.log("payload", payload)
                    if (!mapVM.isInit) {
                        mapVM.initMap(payload, rightDrawerRef, leftDrawerRef);
                    }
                    mapVM.setTarget('map');
                })
        }
    }, [props])
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
