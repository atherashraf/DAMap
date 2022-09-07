import * as React from "react";
import RightDrawer from "../components/drawers/RightDrawer";
import MapVM from "../models/MapVM";
import {RefObject, useEffect} from "react";
import SymbologySetting from "../components/styling/SymbologySetting";
import LayerSwitcherControl from "../components/controls/LayerSwitcherControl";

const designerRightDrawerRef: RefObject<RightDrawer> = React.createRef<RightDrawer>();

interface LayerDesignerProps {
    layerId: string
}

const LayerDesigner = (props: LayerDesignerProps) => {
    const mapVM = new MapVM()
    mapVM.initMap(null, designerRightDrawerRef, null);
    mapVM.setLayerOfInterest(props.layerId)
    useEffect(() => {
        mapVM.setTarget('map');
        // designerRightDrawerRef.current.addContents(
        //     <SymbologySetting key={"symbology-setting"} layerId={props.layerId} mapVM={mapVM}/>)
        designerRightDrawerRef.current.addContents(<LayerSwitcherControl mapVM={mapVM} />)
        mapVM.addVectorLayer({uuid: props.layerId})
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
