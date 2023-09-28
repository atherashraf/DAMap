import * as React from "react";

import MapVM from "../models/MapVM";
import RightDrawer from "../components/drawers/RightDrawer";
import {MapAPIs} from "../utils/MapApi";
import {IDomRef, IMapInfo} from "../TypeDeclaration";
import DADialogBox from "../components/common/DADialogBox";
import DASnackbar from "../components/common/DASnackbar";
import MapPanel from "../components/MapPanel";
import {RefObject} from "react";
import 'jqwidgets-scripts/jqwidgets/styles/jqx.base.css';
import "jqwidgets-scripts/jqwidgets/styles/jqx.web.css";
import DAMapLoading from "../components/common/DAMapLoading";

interface MapVMProps {
    height?: number
    uuid: string | undefined
    isMap: boolean
    isDesigner?: boolean
    isEditor?: boolean
}

interface MapVMState {

}

const mapBoxRef: RefObject<MapPanel> = React.createRef<MapPanel>();
const rightDrawerRef: RefObject<RightDrawer> = React.createRef<RightDrawer>();
// const leftDrawerRef = React.createRef<LeftDrawer>();
const dialogBoxRef: RefObject<DADialogBox> = React.createRef<DADialogBox>();
const snackbarRef: RefObject<DASnackbar> = React.createRef<DASnackbar>();
const loadingRef: RefObject<DAMapLoading> = React.createRef<DAMapLoading>()
// const bottomDrawerRef: RefObject<BottomDrawer> = React.createRef<BottomDrawer>();
// const mapBoxRef: RefObject<MapPanel> = React.createRef<MapPanel>();

class MapView extends React.PureComponent<MapVMProps, MapVMState> {
    private mapDivId = 'map';
    private domRefs: IDomRef = {
        rightDrawerRef: rightDrawerRef,
        // leftDrawerRef: leftDrawerRef
        dialogBoxRef: dialogBoxRef,
        snackBarRef: snackbarRef,
        mapPanelRef: mapBoxRef,
        loadingRef: loadingRef
    }
    private readonly mapVM: MapVM | undefined

    constructor(props: MapVMProps) {
        super(props);
        this.mapVM = new MapVM(this.domRefs, props.isDesigner || false)
    }

    getMapVM() {
        return this.mapVM
    }

    getMapDivId() {
        return this.mapDivId
    }

    componentDidMount() {
        const {props} = this
        if (this.props.isMap && this.props.uuid !== "-1") {
            this.mapVM?.getApi()?.get(MapAPIs.DCH_MAP_INFO, {"uuid": props.uuid})
                .then((payload: IMapInfo) => {
                    // console.log("mapInfo", payload)
                    const mapInfo = Object.assign(payload, {isEditor: props.isEditor})
                    if (!this.mapVM?.isInit) {
                        this.mapVM?.initMap(mapInfo);
                    }
                    this.mapVM?.setTarget(this.mapDivId);
                })
        } else if (this.props.isMap) {
            if (!this.mapVM?.isInit) {
                this.mapVM?.initMap();
            }
            this.mapVM?.setTarget(this.mapDivId);
        } else {
            if (!this.mapVM?.isInit) {
                const info: IMapInfo = {
                    uuid: "-1",
                    layers: [],
                }
                this.mapVM?.initMap(info);
                (async () => {
                    //@ts-ignore
                    await this.mapVM?.addDALayer({uuid: this.props.uuid})
                    //@ts-ignore
                    const extent = await this.mapVM?.getDALayer(this.props?.uuid).getExtent()
                    //@ts-ignore
                    this.mapVM?.setMapFullExtent(extent)
                    this.mapVM?.zoomToFullExtent()
                })();
                //@ts-ignore
                this.mapVM?.setLayerOfInterest(this.props.uuid)
                this.mapVM?.setTarget(this.mapDivId);
                this.mapVM?.setDomRef(this.domRefs)
            }

        }
    }

    render() {
        return (
            <React.Fragment>
                <div id={"fullscreen"} style={{
                    display: "flex",
                    // direction: "column",
                    // padding: "20px",
                    width: "100%",
                    boxSizing: "border-box",
                    height: "100%"
                }}>
                    <MapPanel ref={mapBoxRef}
                        //@ts-ignore
                              mapVM={this.mapVM}/>
                    <RightDrawer ref={rightDrawerRef}/>
                    <DADialogBox ref={dialogBoxRef}/>
                    <DASnackbar ref={snackbarRef}/>
                    <DAMapLoading ref={loadingRef}/>
                </div>
            </React.Fragment>
        )
    }
}


export default MapView;
