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
import {IFeatureStyle, IDomRef, ILayerInfo, IMapInfo} from "../TypeDeclaration";
import RightDrawer from "../components/drawers/RightDrawer";
import LeftDrawer from "../components/drawers/LeftDrawer";
import DADialogBox from "../components/common/DADialogBox";
import DASnackbar from "../components/common/DASnackbar";
import MapPanel from "../components/MapPanel";
import '../static/css/custom_layerswitcher.css';
import Legend from "ol-ext/legend/Legend";
import {Group} from "ol/layer";
import RasterTileLayer from "../layers/RasterTileLayer";
import MapControls from "../layers/MapControls";
import VectorLayer from 'ol/layer/Vector';
import VectorSource from "ol/source/Vector";
import VectorTileSource from "ol/source/VectorTile";
import {Fill, Stroke, Style} from "ol/style";
import CircleStyle from "ol/style/Circle";
import AbstractDALayer from "../layers/AbstractDALayer";
import Draw from 'ol/interaction/Draw';


export interface IDALayers {
    [key: string]: AbstractDALayer
}

interface IOverlays {
    [key: string]: any
}

class MapVM {
    private map: Map = null
    daLayer: IDALayers = {}
    overlayLayers: IOverlays = {}
    private _domRef: IDomRef = null
    private _layerOfInterest: string = null;
    private _vectorLayerAddedEvent = new Event('VectorLayerAdded');
    // @ts-ignore
    mapControls = null;
    // @ts-ignore
    currentMapInteraction = null;
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
    private fullScreen: FullScreen;

    constructor(domRef: IDomRef, isDesigner: boolean) {
        this._domRef = domRef
        this.isDesigner = isDesigner
        this.api = new MapApi(domRef.snackBarRef)
        this.fullScreen = new FullScreen({source: 'fullscreen'})
        this.fullScreen.on('enterfullscreen', this.handleFullScreen.bind(this))
        this.fullScreen.on('leavefullscreen', this.handleFullScreen.bind(this))
        this.mapControls = new MapControls(this);
    }

    handleFullScreen() {
        this.getMapPanelRef().current?.closeBottomDrawer();
    }

    setDomRef(domRef: IDomRef) {
        this._domRef = domRef
    }

    initMap(mapInfo?: IMapInfo) {
        this.map = new Map({
            controls: defaultControls().extend([
                this.fullScreen,
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
            mapInfo.layers.forEach(async (layer) => {
                await this.addDALayer(layer)
            });
        }
        this.addSidebarController();
        // this.addLayerSwitcher(null)
        this.isInit = true;
        this.addSelectionLayer();
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
    getMapPanelRef(): RefObject<MapPanel> {
        return this._domRef.mapPanelRef
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
                    let features = [];
                    //@ts-ignore
                    if (layer.getSource() instanceof VectorTileSource) {
                        //@ts-ignore
                        let tileGrid = layer.getSource().getTileGrid();
                        //@ts-ignore
                        features = layer.getSource().getFeaturesInExtent(tileGrid.getExtent());
                    }
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

    identifyFeature(target: HTMLElement) {
        let me = this;
        me.map.removeInteraction(me.currentMapInteraction);
        me.mapControls.setCurserDisplay('help');
        this.map.on('click', function (evt) {
            me.map.removeInteraction(me.currentMapInteraction);
            me.mapControls.displayFeatureInfo(evt, me, target);
        });
    }

    // @ts-ignore
    addDrawInteraction(drawType) {
        let me = this;
        let source = this.getSelectionLayer().getSource();
        if (this.currentMapInteraction !== null) {
            this.map.removeInteraction(this.currentMapInteraction);
        }
        this.currentMapInteraction = new Draw({
            source: source,
            type: drawType,
        });
        this.map.addInteraction(this.currentMapInteraction);
        // @ts-ignore
        this.currentMapInteraction.on('drawstart', function (e) {
            // console.log("draw start...")
            source.clear();
        });
        // @ts-ignore
        this.currentMapInteraction.on('drawend', function (e) {
            // console.log("draw start...")
            me.mapControls.getRasterAreaFromPolygon(me, e.feature);
        });
    }

    addSelectionLayer() {
        let me = this;
        const title = "sel_layer";
        const vectorLayer = new VectorLayer({
            // @ts-ignore
            title: title,
            source: new VectorSource(),
            style: function (feature) {
                return me.getSelectStyle(feature)
            },
            zIndex: 1000
        });
        this.addOverlayLayer(vectorLayer, title)
    }

    getSelectionLayer(): VectorLayer<VectorSource> {
        // @ts-ignore
        return this.overlayLayers["sel_layer"]
    }

    // @ts-ignore
    getSelectStyle(feature) {
        let g_type = feature.getGeometry().getType();
        let selStyle;
        if (!g_type) g_type = feature.f;
        if (g_type.indexOf('Point') !== -1) {
            selStyle = new Style({
                image: new CircleStyle({
                    radius: 7,
                    fill: new Fill({color: 'rgba(0, 0, 0, 0.33)'}),
                    stroke: new Stroke({
                        color: [0, 0, 0], width: 1.5
                    })
                })
                // image: new ol.style.Icon({
                //     anchor: [0.5, 0.5],
                //     opacity: 1,
                //     src: '/static/assets/img/icons/flashing_circle.gif'
                // })
            });
        } else if (g_type.indexOf('LineString') !== -1) {
            selStyle = new Style({
                stroke: new Stroke({
                    color: '#d17114',
                    width: 5
                }),
            });
        } else {
            selStyle = new Style({
                fill: new Fill({
                    color: 'rgba(209, 113, 20, 0)'
                }),
                stroke: new Stroke({
                    color: '#d17114',
                    width: 3
                })
            });
        }
        return selStyle;
    }

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
    addOverlayLayer(layer: any, title: string) {
        // @ts-ignore
        this.overlayLayers[title] = layer
        this.map.addLayer(layer)
    }

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

    async addDALayer(info: { uuid: string, style?: IFeatureStyle, visible?: boolean, zoomRange?: [number, number] }) {
        const {uuid, style, zoomRange} = info
        const payload: ILayerInfo = await this.api.get(MapAPIs.DCH_LAYER_INFO, {uuid: uuid})
        if (payload) {
            if (style)
                payload.style = style
            if (zoomRange)
                payload.zoomRange = zoomRange
            let daLayer: AbstractDALayer;
            this._domRef.snackBarRef.current.show(`Adding ${payload.title} Layer`)
            if (payload?.dataModel === 'V') {
                daLayer = new MVTLayer(payload, this);
                window.dispatchEvent(this._vectorLayerAddedEvent)
            } else {
                daLayer = new RasterTileLayer(payload, this)
            }
            const visible = info.visible != undefined ? info.visible : true
            daLayer.getOlLayer().setVisible(visible)
            this.daLayer[payload.uuid] = daLayer
        }
    }

    getDALayer(layerId: string | undefined): AbstractDALayer {
        if (layerId)
            return this.daLayer[layerId]
    }

    showSnackbar(msg: string) {
        this._domRef.snackBarRef.current.show(msg)
    }

    drawPolygonForRasterArea() {
        this.addDrawInteraction("Polygon")
    }
}

export default MapVM;
