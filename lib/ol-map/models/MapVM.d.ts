import 'ol/ol.css';
import 'ol-ext/dist/ol-ext.css';
import Map from 'ol/Map';
import MapApi from "../utils/MapApi";
import { RefObject } from "react";
import { IFeatureStyle, IDomRef, IMapInfo } from "../TypeDeclaration";
import RightDrawer from "../components/drawers/RightDrawer";
import LeftDrawer from "../components/drawers/LeftDrawer";
import DADialogBox from "../components/common/DADialogBox";
import DASnackbar from "../components/common/DASnackbar";
import MapPanel from "../components/MapPanel";
import '../static/css/custom_layerswitcher.css';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from "ol/source/Vector";
import AbstractDALayer from "../layers/AbstractDALayer";
export interface IDALayers {
    [key: string]: AbstractDALayer;
}
interface IOverlays {
    [key: string]: any;
}
declare class MapVM {
    private map;
    daLayers: IDALayers;
    overlayLayers: IOverlays;
    private _domRef;
    private _layerOfInterest;
    private _vectorLayerAddedEvent;
    mapControls: any;
    currentMapInteraction: any;
    mapExtent: number[];
    isInit: Boolean;
    readonly api: MapApi;
    private readonly isDesigner;
    private fullScreen;
    constructor(domRef: IDomRef, isDesigner: boolean);
    handleFullScreen(): void;
    setDomRef(domRef: IDomRef): void;
    initMap(mapInfo?: IMapInfo): void;
    setMapFullExtent(extent: number[]): void;
    getApi(): MapApi;
    getMapPanelRef(): RefObject<MapPanel>;
    getRightDrawerRef(): RefObject<RightDrawer>;
    getLeftDrawerRef(): RefObject<LeftDrawer>;
    getDialogBoxRef(): RefObject<DADialogBox>;
    getSnackbarRef(): RefObject<DASnackbar>;
    getLayerOfInterest(): string;
    setLayerOfInterest(value: string): void;
    addBaseLayers(): void;
    addSidebarController(): void;
    addLayerSwitcher(target: HTMLElement): void;
    setTarget(target: string): void;
    refreshMap(): void;
    getMap(): Map;
    zoomToFullExtent(): void;
    identifyFeature(target: HTMLElement): void;
    addDrawInteraction(drawType: any, target: any): void;
    addSelectionLayer(): void;
    getSelectionLayer(): VectorLayer<VectorSource>;
    getOverlayLayer(layer_name: string): VectorLayer<VectorSource>;
    getSelectStyle(feature: any): any;
    addOverlayLayer(layer: any, title: string): void;
    addDALayer(info: {
        uuid: string;
        style?: IFeatureStyle;
        visible?: boolean;
        zoomRange?: [number, number];
    }): Promise<void>;
    getDALayer(layerId: string | undefined): AbstractDALayer;
    showSnackbar(msg: string): void;
    drawPolygonForRasterArea(target: HTMLElement): void;
}
export default MapVM;
