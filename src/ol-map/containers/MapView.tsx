import * as React from "react";
import MapVM from "../models/MapVM";
import {RefObject, useEffect} from "react";
import LeftDrawer from "../components/drawers/LeftDrawer";
import RightDrawer from "../components/drawers/RightDrawer";
import {APIs} from "../utils/Api";
import {IDomRef, IMapInfo} from "../TypeDeclaration";
import DADialogBox from "../components/common/DADialogBox";
import DASnackbar from "../components/common/DASnackbar";


interface MapVMProps {
    height?: number,
    uuid: string
}

const MapView = (props: MapVMProps) => {
    const leftDrawerRef = React.createRef<LeftDrawer>();
    const rightDrawerRef = React.createRef<RightDrawer>();
    const dialogBoxRef: RefObject<DADialogBox> = React.createRef<DADialogBox>();
    const snackbarRef: RefObject<DASnackbar> = React.createRef<DASnackbar>();
    const domRefs: IDomRef = {
        rightDrawerRef: rightDrawerRef,
        dialogBoxRef: dialogBoxRef,
        snackBarRef: snackbarRef
    }
    const mapVM = new MapVM(domRefs, false)
    useEffect(() => {
        const {uuid} = props
        if (uuid) {
            mapVM.getApi().get(APIs.DCH_MAP_INFO, {"uuid": props.uuid})
                .then((payload: IMapInfo) => {
                    if (!mapVM.isInit) {
                        mapVM.initMap(payload);
                    }
                    mapVM.setTarget('map');
                })
        }
    }, [props])
    return (
        <React.Fragment>
            <div id={"fullscreen"} style={{
                display: "flex",
                padding: "20px",
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
