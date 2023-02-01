var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as React from "react";
import MapVM from "../models/MapVM";
import RightDrawer from "../components/drawers/RightDrawer";
import { MapAPIs } from "../utils/MapApi";
import DADialogBox from "../components/common/DADialogBox";
import DASnackbar from "../components/common/DASnackbar";
import MapPanel from "../components/MapPanel";
const mapBoxRef = React.createRef();
const rightDrawerRef = React.createRef();
// const leftDrawerRef = React.createRef<LeftDrawer>();
const dialogBoxRef = React.createRef();
const snackbarRef = React.createRef();
// const bottomDrawerRef: RefObject<BottomDrawer> = React.createRef<BottomDrawer>();
// const mapBoxRef: RefObject<MapPanel> = React.createRef<MapPanel>();
class MapView extends React.PureComponent {
    constructor(props) {
        super(props);
        this.mapDivId = 'map';
        this.domRefs = {
            rightDrawerRef: rightDrawerRef,
            // leftDrawerRef: leftDrawerRef
            dialogBoxRef: dialogBoxRef,
            snackBarRef: snackbarRef,
            mapPanelRef: mapBoxRef
        };
        this.mapVM = null;
        this.mapVM = new MapVM(this.domRefs, props.isDesigner);
    }
    getMapVM() {
        return this.mapVM;
    }
    getMapDivId() {
        return this.mapDivId;
    }
    componentDidMount() {
        if (this.props.isMap) {
            this.mapVM.getApi().get(MapAPIs.DCH_MAP_INFO, { "uuid": this.props.uuid })
                .then((payload) => {
                if (!this.mapVM.isInit) {
                    this.mapVM.initMap(payload);
                }
                this.mapVM.setTarget(this.mapDivId);
            });
        }
        else {
            (() => __awaiter(this, void 0, void 0, function* () {
                yield this.mapVM.addDALayer({ uuid: this.props.uuid });
                const extent = yield this.mapVM.getDALayer(this.props.uuid).getExtent();
                this.mapVM.setMapFullExtent(extent);
                this.mapVM.zoomToFullExtent();
            }))();
            this.mapVM.setLayerOfInterest(this.props.uuid);
            this.mapVM.setTarget(this.mapDivId);
            this.mapVM.setDomRef(this.domRefs);
        }
    }
    render() {
        return (React.createElement(React.Fragment, null,
            React.createElement("div", { id: "fullscreen", style: {
                    display: "flex",
                    // direction: "column",
                    // padding: "20px",
                    width: "100%",
                    boxSizing: "border-box",
                    height: "100%"
                } },
                React.createElement(MapPanel, { ref: mapBoxRef, mapVM: this.mapVM }),
                React.createElement(RightDrawer, { ref: rightDrawerRef }),
                React.createElement(DADialogBox, { ref: dialogBoxRef }),
                React.createElement(DASnackbar, { ref: snackbarRef }))));
    }
}
export default MapView;
