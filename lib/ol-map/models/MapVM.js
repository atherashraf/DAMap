var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import 'ol/ol.css';
import 'ol-ext/dist/ol-ext.css';
import Map from 'ol/Map';
import View from 'ol/View';
import { defaults as defaultControls, FullScreen } from 'ol/control';
import BaseLayers from "../layers/BaseLayers";
import LayerSwitcher from "ol-ext/control/LayerSwitcher";
import MapToolbar from "../components/MapToolbar";
import MVTLayer from "../layers/MVTLayer";
import MapApi, { MapAPIs } from "../utils/MapApi";
import '../static/css/custom_layerswitcher.css';
import Legend from "ol-ext/legend/Legend";
import { Group } from "ol/layer";
import RasterTileLayer from "../layers/RasterTileLayer";
import MapControls from "../layers/MapControls";
import VectorLayer from 'ol/layer/Vector';
import VectorSource from "ol/source/Vector";
import VectorTileSource from "ol/source/VectorTile";
import { Fill, Stroke, Style } from "ol/style";
import CircleStyle from "ol/style/Circle";
import Draw from 'ol/interaction/Draw';
class MapVM {
    constructor(domRef, isDesigner) {
        this.daLayer = {};
        this.overlayLayers = {};
        this._layerOfInterest = null;
        this._vectorLayerAddedEvent = new Event('VectorLayerAdded');
        // @ts-ignore
        this.mapControls = null;
        // @ts-ignore
        this.currentMapInteraction = null;
        // leftDrawerRef: any
        this.mapExtent = [
            7031250.271849444,
            2217134.3474655207,
            8415677.728150556,
            4922393.652534479
        ];
        this.isInit = false;
        this._domRef = domRef;
        this.isDesigner = isDesigner;
        this.api = new MapApi(domRef.snackBarRef);
        this.fullScreen = new FullScreen({ source: 'fullscreen' });
        this.fullScreen.on('enterfullscreen', this.handleFullScreen.bind(this));
        this.fullScreen.on('leavefullscreen', this.handleFullScreen.bind(this));
        this.mapControls = new MapControls(this);
    }
    handleFullScreen() {
        var _a;
        (_a = this.getMapPanelRef().current) === null || _a === void 0 ? void 0 : _a.closeBottomDrawer();
    }
    setDomRef(domRef) {
        this._domRef = domRef;
    }
    initMap(mapInfo) {
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
        this.addBaseLayers();
        if (mapInfo) {
            this.mapExtent = mapInfo.extent;
            mapInfo.layers.forEach((layer) => __awaiter(this, void 0, void 0, function* () {
                yield this.addDALayer(layer);
            }));
        }
        this.addSidebarController();
        // this.addLayerSwitcher(null)
        this.isInit = true;
        this.addSelectionLayer();
    }
    setMapFullExtent(extent) {
        this.mapExtent = extent;
    }
    getApi() {
        return this.api;
    }
    // getBottomDrawerRef(): RefObject<BottomDrawer>{
    //     return this._domRef.bottomDrawerRef
    // }
    getMapPanelRef() {
        return this._domRef.mapPanelRef;
    }
    getRightDrawerRef() {
        return this._domRef.rightDrawerRef;
    }
    getLeftDrawerRef() {
        return this._domRef.leftDrawerRef;
    }
    getDialogBoxRef() {
        return this._domRef.dialogBoxRef;
    }
    getSnackbarRef() {
        return this._domRef.snackBarRef;
    }
    getLayerOfInterest() {
        return this._layerOfInterest;
    }
    setLayerOfInterest(value) {
        this._layerOfInterest = value;
    }
    addBaseLayers() {
        const bl = new BaseLayers(this);
        bl.addBaseLayers();
        // const osm = bl.getBingMapLayer("AerialWithLabelsOnDemand")
        // this.map.addLayer(osm)
    }
    addSidebarController() {
        // let sidebarElem: HTMLElement = document.querySelector('.sidebar');
        // sidebarElem.style.display = "block";
        // let sidebar: Sidebar = new Sidebar({element: 'sidebar', position: 'right'});
        // this.getMap().addControl(sidebar);
    }
    addLayerSwitcher(target) {
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
                }
                else {
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
                        let gType = features[0].getGeometry().getType();
                        //@ts-ignore
                        let img = Legend.getLegendImage({
                            /* given a style  and a geom type*/
                            //@ts-ignore
                            style: layer.getStyle(),
                            typeGeom: gType
                        });
                        e.li.appendChild(img);
                    }
                }
            }
            // document.getElementsByClassName('ol-layerswitcher-buttons')[0].append(e.li)
        });
        this.map.addControl(lswitcher);
    }
    setTarget(target) {
        this.map.setTarget(target);
        this.zoomToFullExtent();
        setTimeout(() => this.map.updateSize(), 2000);
    }
    refreshMap() {
        setTimeout(() => this.map.updateSize(), 500);
    }
    getMap() {
        return this.map;
    }
    zoomToFullExtent() {
        // const extent = [7031250.271849444, 2217134.3474655207, 8415677.728150556, 4922393.652534479]
        // @ts-ignore
        this.map.getView().fit(this.mapExtent, this.map.getSize());
    }
    identifyFeature(target) {
        let me = this;
        // me.mapControls.add_lbdc_discharge_head_tail(me); //fo layer test
        me.map.removeInteraction(me.currentMapInteraction);
        me.currentMapInteraction = null;
        me.mapControls.setCurserDisplay('help');
        this.map.on('click', function (evt) {
            // me.map.removeInteraction(me.currentMapInteraction);
            if (!(me.currentMapInteraction instanceof Draw)) {
                me.mapControls.displayFeatureInfo(evt, me, target);
            }
        });
    }
    // @ts-ignore
    addDrawInteraction(drawType, target) {
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
            me.mapControls.getRasterAreaFromPolygon(me, target, e.feature);
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
                return me.getSelectStyle(feature);
            },
            zIndex: 1000
        });
        this.addOverlayLayer(vectorLayer, title);
    }
    getSelectionLayer() {
        // @ts-ignore
        return this.overlayLayers["sel_layer"];
    }
    getOverlayLayer(layer_name) {
        // @ts-ignore
        return this.overlayLayers[layer_name];
    }
    // @ts-ignore
    getSelectStyle(feature) {
        let g_type = feature.getGeometry().getType();
        let selStyle;
        if (!g_type)
            g_type = feature.f;
        if (g_type.indexOf('Point') !== -1) {
            selStyle = new Style({
                image: new CircleStyle({
                    radius: 7,
                    fill: new Fill({ color: 'rgba(0, 0, 0, 0.33)' }),
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
        }
        else if (g_type.indexOf('LineString') !== -1) {
            selStyle = new Style({
                stroke: new Stroke({
                    color: '#d17114',
                    width: 5
                }),
            });
        }
        else {
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
    addOverlayLayer(layer, title) {
        // @ts-ignore
        this.overlayLayers[title] = layer;
        this.map.addLayer(layer);
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
    addDALayer(info) {
        return __awaiter(this, void 0, void 0, function* () {
            const { uuid, style, zoomRange } = info;
            const payload = yield this.api.get(MapAPIs.DCH_LAYER_INFO, { uuid: uuid });
            if (payload) {
                if (style)
                    payload.style = style;
                if (zoomRange)
                    payload.zoomRange = zoomRange;
                let daLayer;
                this._domRef.snackBarRef.current.show(`Adding ${payload.title} Layer`);
                if ((payload === null || payload === void 0 ? void 0 : payload.dataModel) === 'V') {
                    daLayer = new MVTLayer(payload, this);
                    window.dispatchEvent(this._vectorLayerAddedEvent);
                }
                else {
                    daLayer = new RasterTileLayer(payload, this);
                }
                const visible = info.visible != undefined ? info.visible : true;
                daLayer.getOlLayer().setVisible(visible);
                this.daLayer[payload.uuid] = daLayer;
            }
        });
    }
    getDALayer(layerId) {
        if (layerId)
            return this.daLayer[layerId];
    }
    showSnackbar(msg) {
        this._domRef.snackBarRef.current.show(msg);
    }
    drawPolygonForRasterArea(target) {
        this.addDrawInteraction("Polygon", target);
    }
}
export default MapVM;
