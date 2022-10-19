import 'ol/ol.css';
import 'ol-ext/dist/ol-ext.css'
// import '../static/css/LayerSwitcher.css'
// @ts-ignore
import RedPinIcon from "../static/img/red_pin_icon_16.png"

import Map from 'ol/Map';
import View from 'ol/View';


import {defaults as defaultControls, FullScreen} from 'ol/control';
import BaseLayers from "../layers/BaseLayers";
import LayerSwitcher from "ol-ext/control/LayerSwitcher";
import MapToolbar from "../components/MapToolbar";
import MVTLayer from "../layers/MVTLayer";
import MapApi, {MapAPIs} from "../utils/MapApi";
import {RefObject} from "react";
import AbstractVectorLayer from "../layers/AbstractVectorLayer";
import {IFeatureStyle, IDomRef, ILayerInfo, IMapInfo} from "../TypeDeclaration";
import RightDrawer from "../components/drawers/RightDrawer";
import LeftDrawer from "../components/drawers/LeftDrawer";
import DADialogBox from "../components/common/DADialogBox";
import DASnackbar from "../components/common/DASnackbar";
import MapPanel from "../components/MapPanel";
import '../static/css/custom_layerswitcher.css';
import Legend from "ol-ext/legend/Legend";
import {Group} from "ol/layer";


export interface IDALayers {
    [key: string]: AbstractVectorLayer
}


class MapVM {
    private map: Map = null
    daLayer: IDALayers = {}
    private _domRef: IDomRef = null
    private _layerOfInterest: string = null;
    private _vectorLayerAddedEvent = new Event('VectorLayerAdded');
    // leftDrawerRef: any
    mapExtent: number[] = [
        7031250.271849444,
        2217134.3474655207,
        8415677.728150556,
        4922393.652534479
    ]
    isInit: Boolean = false;
    private readonly api: MapApi;
    private readonly isDesigner: boolean;

    constructor(domRef: IDomRef, isDesigner: boolean) {
        this._domRef = domRef
        this.isDesigner = isDesigner
        this.api = new MapApi(domRef.snackBarRef)
    }

    setDomRef(domRef: IDomRef) {
        this._domRef = domRef
    }

    initMap(mapInfo?: IMapInfo) {
        this.map = new Map({
            controls: defaultControls().extend([
                new FullScreen({source: 'fullscreen'}),
                new MapToolbar({
                    mapVM: this,
                    isDesigner: this.isDesigner
                })
            ]),
            view: new View({
                center: [7723464, 3569764],
                zoom: 5
            }),
        });
        this.addBaseLayers()
        if (mapInfo) {
            this.mapExtent = mapInfo.extent;
            mapInfo.layers.forEach((layer) => {
                this.addVectorLayer(layer).then(() => {
                })
            });
        }
        this.addSidebarController();
        // this.addLayerSwitcher(null)
        this.isInit = true;
    }

    setMapFullExtent(extent: number[]) {
        this.mapExtent = extent
    }

    getApi() {
        return this.api;
    }

    // getBottomDrawerRef(): RefObject<BottomDrawer>{
    //     return this._domRef.bottomDrawerRef
    // }
    getMapBoxRef(): RefObject<MapPanel> {
        return this._domRef.mapBoxRef
    }

    getRightDrawerRef(): RefObject<RightDrawer> {
        return this._domRef.rightDrawerRef
    }

    getLeftDrawerRef(): RefObject<LeftDrawer> {
        return this._domRef.leftDrawerRef
    }

    getDialogBoxRef(): RefObject<DADialogBox> {
        return this._domRef.dialogBoxRef
    }

    getSnackbarRef(): RefObject<DASnackbar> {
        return this._domRef.snackBarRef
    }

    getLayerOfInterest(): string {
        return this._layerOfInterest;
    }

    setLayerOfInterest(value: string) {
        this._layerOfInterest = value;
    }

    addBaseLayers() {
        const bl = new BaseLayers(this)
        bl.addBaseLayers()
        // const osm = bl.getBingMapLayer("AerialWithLabelsOnDemand")
        // this.map.addLayer(osm)
    }

    addSidebarController() {
        // let sidebarElem: HTMLElement = document.querySelector('.sidebar');
        // sidebarElem.style.display = "block";
        // let sidebar: Sidebar = new Sidebar({element: 'sidebar', position: 'right'});
        // this.getMap().addControl(sidebar);
    }

    addLayerSwitcher(target: HTMLElement) {
        let lswitcher = new LayerSwitcher({
            // target:$(".layerSwitcher").get(0),
            target: target,
            // displayInLayerSwitcher: function (l) { return false; },
            show_progress: true,
            // extent: true,
            // trash: true,
            // oninfo: function (l) { alert(l.get("title")); }
        });
        lswitcher.on('drawlist', function (e) {
            let layer = e.layer;
            if (!(layer instanceof Group) && !(layer.get('baseLayer'))) {
                if (layer.hasOwnProperty('legend')) {
                    //@ts-ignore
                    layer.legend['graphic'].render(e.li);
                } else {
                    //@ts-ignore
                    let tileGrid = layer.getSource().getTileGrid()
                    //@ts-ignore
                    let features = layer.getSource().getFeaturesInExtent(tileGrid.getExtent());
                    if (features && features.length > 0) {
                        let gType = features[0].getGeometry().getType()
                        //@ts-ignore
                        let img = Legend.getLegendImage({
                            /* given a style  and a geom type*/
                            //@ts-ignore
                            style: layer.getStyle(),
                            typeGeom: gType

                        });
                        e.li.appendChild(img)

                    }

                }
            }
            // document.getElementsByClassName('ol-layerswitcher-buttons')[0].append(e.li)
        })
        this.map.addControl(lswitcher)
    }

    setTarget(target: string) {
        this.map.setTarget(target);
        this.zoomToFullExtent()
        setTimeout(() => this.map.updateSize(), 2000);

    }

    refreshMap() {
        setTimeout(() => this.map.updateSize(), 500);
    }

    getMap(): Map {
        return this.map;
    }

    zoomToFullExtent() {
        // const extent = [7031250.271849444, 2217134.3474655207, 8415677.728150556, 4922393.652534479]
        // @ts-ignore
        this.map.getView().fit(this.mapExtent, this.map.getSize());
    }

    // addSelectionLayer() {
    //     const title = "sel_layer";
    //     const vectorLayer = new VectorLayer({
    //         // @ts-ignore
    //         title: title,
    //         source: new VectorSource(),
    //         style: new Style({
    //             image: new CircleStyle({
    //                 radius: 10,
    //                 fill: new Fill({color: 'yellow'}),
    //                 stroke: new Stroke({
    //                     color: [0, 0, 0], width: 3
    //                 })
    //             })
    //         })
    //     });
    //     this.addOverlayLayer(vectorLayer, title)
    // }
    //
    // getSelectionLayer(): VectorLayer<VectorSource> {
    //     // @ts-ignore
    //     return this.overlayLayers["sel_layer"]
    // }
    //
    // getIconStyle() {
    //     return new Style({
    //         image: new Icon({
    //             anchor: [0.5, 15],
    //             anchorXUnits: 'fraction',
    //             anchorYUnits: 'pixels',
    //             src: RedPinIcon
    //         }),
    //     });
    // }
    //
    //
    // addGeoJSONLayer(geojsonObject: object) {
    //     const title = "project_location"
    //     const vectorSource = new VectorSource({
    //         features: new GeoJSON().readFeatures(geojsonObject),
    //     });
    //     const vectorLayer = new VectorLayer({
    //         //@ts-ignore
    //         title: title,
    //         source: vectorSource,
    //         style: () => this.getIconStyle()
    //     });
    //     this.addOverlayLayer(vectorLayer, title)
    // }
    //
    // addOverlayLayer(layer: VectorLayer<any>, title: string) {
    //     // @ts-ignore
    //     this.overlayLayers[title] = layer
    //     this.map.addLayer(layer)
    // }
    //
    // selectFeature(id: any) {
    //     // console.log("feature " + id)
    //     // @ts-ignore
    //     const layer = this.overlayLayers["project_location"]
    //     const source = layer.getSource()
    //     const feature = source.getFeatures().find((feature: Feature) => {
    //         const properties = feature.getProperties()
    //         if (properties.id === id)
    //             return feature
    //     })
    //     // this.flash(feature)
    //     const sel_source = this.getSelectionLayer().getSource()
    //     sel_source.addFeature(feature)
    //
    // }
    //
    // clearSelectedFeatures() {
    //     const source = this.getSelectionLayer().getSource()
    //     source.clear()
    // }
    //
    // zoomToSelectedFeatures() {
    //     const layer = this.getSelectionLayer()
    //     const extent = buffer(layer.getSource().getExtent(), 20 * 1000)
    //     // @ts-ignore
    //     extent && this.map.getView().fit(extent, this.map.getSize());
    //
    // }


    async addVectorLayer(info: { uuid: string, style?: IFeatureStyle, visible?: boolean, zoomRange?: [number, number] }) {
        const {uuid, style, zoomRange} = info
        const payload: ILayerInfo = await this.api.get(MapAPIs.DCH_LAYER_INFO, {uuid: uuid})
        if (payload) {
            if (style)
                payload.style = style
            if (zoomRange)
                payload.zoomRange = zoomRange
            const mvtLayer = new MVTLayer(payload, this);
            const visible = info.visible != undefined ? info.visible : true
            mvtLayer.getOlLayer().setVisible(visible)

            this.daLayer[payload.uuid] = mvtLayer
            window.dispatchEvent(this._vectorLayerAddedEvent)
        }
    }


    getDALayer(layerId: string | undefined): AbstractVectorLayer {
        if (layerId)
            return this.daLayer[layerId]
    }

    showSnackbar(msg: string) {
        this._domRef.snackBarRef.current.show(msg)
    }
}

export default MapVM;
