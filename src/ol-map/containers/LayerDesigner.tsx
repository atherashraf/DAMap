import * as React from "react";
import RightDrawer from "../components/drawers/RightDrawer";
import MapVM from "../models/MapVM";
import {RefObject, useEffect} from "react";
import DADialogBox from "../components/common/DADialogBox";
import {IDomRef} from "../TypeDeclaration";
import DASnackbar from "../components/common/DASnackbar";


interface LayerDesignerProps {
    layerId: string
}

const LayerDesigner = (props: LayerDesignerProps) => {
    const rightDrawerRef: RefObject<RightDrawer> = React.createRef<RightDrawer>();
    const dialogBoxRef: RefObject<DADialogBox> = React.createRef<DADialogBox>();
    const snackbarRef: RefObject<DASnackbar> = React.createRef<DASnackbar>();
    const domRefs: IDomRef = {
        rightDrawerRef: rightDrawerRef,
        dialogBoxRef: dialogBoxRef,
        snackBarRef: snackbarRef
    }

    const mapVM = new MapVM(domRefs, true)
    mapVM.initMap();
    mapVM.setLayerOfInterest(props.layerId)
    useEffect(() => {
        mapVM.setTarget('map');
        initLayer().then(() => {});

        // setTimeout(() => designerRightDrawerRef.current.toggleDrawer(), 1000)
    }, [])
    const initLayer = async () => {
        await mapVM.addVectorLayer({uuid: props.layerId})
        const extent = await mapVM.getDALayer(props.layerId).getExtent()
        // console.log("extent", extent)
        mapVM.setMapFullExtent(extent)
        mapVM.zoomToFullExtent()
    }
    return (
        <React.Fragment>
            <div id={"fullscreen"} style={{
                display: "flex",
                padding: "20px",
                width: "100%",
                boxSizing: "border-box",
                height: "100%"
            }}>

                <div id={"map"} style={{
                    width: "100%",
                    height: "100%"
                }}/>
                <RightDrawer ref={rightDrawerRef}/>
                <DADialogBox ref={dialogBoxRef}/>
                <DASnackbar ref={snackbarRef}/>
            </div>
        </React.Fragment>
    )
}

export default LayerDesigner
