import * as React from "react";
import RightDrawer from "../components/drawers/RightDrawer";
import MapVM from "../models/MapVM";
import {RefObject, useEffect} from "react";
import SymbologySetting from "../components/styling/SymbologySetting";

const designerRightDrawerRef: RefObject<RightDrawer> = React.createRef<RightDrawer>();

interface LayerDesignerProps {
    layerId: string
}

const LayerDesigner = (props: LayerDesignerProps) => {
    const mapVM = new MapVM()
    mapVM.initMap(null, designerRightDrawerRef, null);
    useEffect(() => {
        mapVM.setTarget('map');
        designerRightDrawerRef.current.addContents(
            <SymbologySetting key={"symbology-setting"} layerId={props.layerId} mapVM={mapVM}/>)
        mapVM.addVectorLayer(props.layerId)
        setTimeout(() => designerRightDrawerRef.current.toggleDrawer(), 1000)

    })
    return (
        <div style={{
            display: "flex",
            padding: "50px",
            width: "100%",
            boxSizing: "border-box",
            height: "100%"
        }}>
            <div id={"map"} style={{
                width: "100%",
                height: "100%"
            }}/>
            <RightDrawer ref={designerRightDrawerRef}/>
        </div>
    )
}

export default LayerDesigner
