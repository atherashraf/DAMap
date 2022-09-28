import * as React from "react";
import MapVM from "../models/MapVM";
import {RefObject, useEffect} from "react";
// import LeftDrawer from "../components/drawers/LeftDrawer";
import RightDrawer from "../components/drawers/RightDrawer";
import {APIs} from "../utils/Api";
import {IDomRef, IMapInfo} from "../TypeDeclaration";
import DADialogBox from "../components/common/DADialogBox";
import DASnackbar from "../components/common/DASnackbar";
import MapPanel from "../components/MapPanel";


interface MapVMProps {
    height?: number
    uuid: string
    isMap: boolean
    isDesigner?: boolean
}

const MapView = (props: MapVMProps) => {
    const mapDivId = 'map';
    const rightDrawerRef: RefObject<RightDrawer> = React.createRef<RightDrawer>();
    // const leftDrawerRef = React.createRef<LeftDrawer>();
    const dialogBoxRef: RefObject<DADialogBox> = React.createRef<DADialogBox>();
    const snackbarRef: RefObject<DASnackbar> = React.createRef<DASnackbar>();
    // const bottomDrawerRef: RefObject<BottomDrawer> = React.createRef<BottomDrawer>();
    const mapBoxRef: RefObject<MapPanel> = React.createRef<MapPanel>();
    const domRefs: IDomRef = {
        rightDrawerRef: rightDrawerRef,
        // leftDrawerRef: leftDrawerRef
        dialogBoxRef: dialogBoxRef,
        snackBarRef: snackbarRef,
        mapBoxRef: mapBoxRef
    }

    const mapVM = new MapVM(domRefs, props.isDesigner)
    mapVM.initMap();

    useEffect(() => {
        if (props.isMap) {
            mapVM.getApi().get(APIs.DCH_MAP_INFO, {"uuid": props.uuid})
                .then((payload: IMapInfo) => {
                    if (!mapVM.isInit) {
                        mapVM.initMap(payload);
                    }
                    mapVM.setTarget(mapDivId);
                })
        }else{
            (async () => {
                await mapVM.addVectorLayer({uuid: props.uuid})
                const extent = await mapVM.getDALayer(props.uuid).getExtent()
                mapVM.setMapFullExtent(extent)
                mapVM.zoomToFullExtent()
            })();
            mapVM.setLayerOfInterest(props.uuid)
            mapVM.setTarget(mapDivId);
        }
    }, [props])
    return (
        <React.Fragment>
            <div id={"fullscreen"} style={{
                display: "flex",
                // direction: "column",
                padding: "20px",
                width: "100%",
                boxSizing: "border-box",
                height: "100%"
            }}>

                <MapPanel ref={mapBoxRef} mapVM={mapVM}/>
                <RightDrawer ref={rightDrawerRef}/>
                <DADialogBox ref={dialogBoxRef}/>
                <DASnackbar ref={snackbarRef}/>
            </div>
        </React.Fragment>
    )
}

export default MapView;
