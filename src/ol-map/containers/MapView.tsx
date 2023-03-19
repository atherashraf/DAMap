import * as React from "react";

import MapVM from "../models/MapVM";
import RightDrawer from "../components/drawers/RightDrawer";
import {MapAPIs} from "../utils/MapApi";
import {IDomRef, IFeatureStyle, IMapInfo} from "../TypeDeclaration";
import DADialogBox from "../components/common/DADialogBox";
import DASnackbar from "../components/common/DASnackbar";
import MapPanel from "../components/MapPanel";
import {RefObject} from "react";
import 'jqwidgets-scripts/jqwidgets/styles/jqx.base.css';
import "jqwidgets-scripts/jqwidgets/styles/jqx.web.css";

interface MapVMProps {
    height?: number
    uuid: string
    isMap: boolean
    isDesigner?: boolean
}

interface MapVMState {

}

const mapBoxRef: RefObject<MapPanel> = React.createRef<MapPanel>();
const rightDrawerRef: RefObject<RightDrawer> = React.createRef<RightDrawer>();
// const leftDrawerRef = React.createRef<LeftDrawer>();
const dialogBoxRef: RefObject<DADialogBox> = React.createRef<DADialogBox>();
const snackbarRef: RefObject<DASnackbar> = React.createRef<DASnackbar>();
// const bottomDrawerRef: RefObject<BottomDrawer> = React.createRef<BottomDrawer>();
// const mapBoxRef: RefObject<MapPanel> = React.createRef<MapPanel>();

class MapView extends React.PureComponent<MapVMProps, MapVMState> {
    private mapDivId = 'map';
    private domRefs: IDomRef = {
        rightDrawerRef: rightDrawerRef,
        // leftDrawerRef: leftDrawerRef
        dialogBoxRef: dialogBoxRef,
        snackBarRef: snackbarRef,
        mapPanelRef: mapBoxRef
    }
    private readonly mapVM: MapVM = null

    constructor(props: MapVMProps) {
        super(props);
        this.mapVM = new MapVM(this.domRefs, props.isDesigner)
    }

    getMapVM() {
        return this.mapVM
    }

    getMapDivId() {
        return this.mapDivId
    }

    componentDidMount() {
        if (this.props.isMap) {
            this.mapVM.getApi().get(MapAPIs.DCH_MAP_INFO, {"uuid": this.props.uuid})
                .then((payload: IMapInfo) => {
                    // console.log("payload", payload)
                    if (!this.mapVM.isInit) {
                        this.mapVM.initMap(payload);
                    }
                    this.mapVM.setTarget(this.mapDivId);
                })
        } else {
            if (!this.mapVM.isInit) {
                const info: IMapInfo = {
                    layers: [{ uuid: this.props.uuid, style: null, visible: true }],
                }
                this.mapVM.initMap(info);
            }
            (async () => {
                await this.mapVM.addDALayer({uuid: this.props.uuid})
                const extent = await this.mapVM.getDALayer(this.props.uuid).getExtent()
                this.mapVM.setMapFullExtent(extent)
                this.mapVM.zoomToFullExtent()
            })();
            this.mapVM.setLayerOfInterest(this.props.uuid)
            this.mapVM.setTarget(this.mapDivId);
            this.mapVM.setDomRef(this.domRefs)
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

                    <MapPanel ref={mapBoxRef} mapVM={this.mapVM}/>
                    <RightDrawer ref={rightDrawerRef}/>
                    <DADialogBox ref={dialogBoxRef}/>
                    <DASnackbar ref={snackbarRef}/>
                </div>
            </React.Fragment>
        )
    }
}


export default MapView;
