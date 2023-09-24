import 'ol/ol.css';
import 'ol-ext/dist/ol-ext.css';
import '../../static/css/da-ol.css';
import * as React from "react";
// @ts-ignore
import RedPinIcon from "../static/img/red_pin_icon_16.png"
import Map from 'ol/Map';
import View from 'ol/View';
import {defaults as defaultControls, FullScreen} from 'ol/control';
import BaseLayers from "../layers/BaseLayers";
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
import Legend from "ol-ext/control/Legend";
import ol_legend_Legend from "ol-ext/legend/Legend";
import RasterTileLayer from "../layers/RasterTileLayer";
import VectorLayer from 'ol/layer/Vector';
import VectorSource from "ol/source/Vector";
import AbstractDALayer from "../layers/AbstractDALayer";
import Draw from 'ol/interaction/Draw';
//@ts-ignore
import MapControls from "../layers/MapControls";
import AttributeGrid from "../../widgets/grid/AttributeGrid";
import SelectionLayer from "../layers/SelectionLayer";

import LayerSwitcherPaper from "../components/LayerSwitcher/LayerSwitcherPaper";
import autoBind from "auto-bind";
import {Column, Row} from "../../widgets/grid/GridTypeDeclaration";
import WeatherLayers, {weatherLayers} from "../layers/WeatherLayers";
import DAMapLoading from "../components/common/DAMapLoading";
import TimeSlider from "../components/controls/TimeSlider";


export interface IDALayers {
    [key: string]: AbstractDALayer
}

interface IOverlays {
    [key: string]: any
}

class MapVM {
    private map: Map
    daLayers: IDALayers = {}
    overlayLayers: IOverlays = {}
    private _domRef: IDomRef
    private _layerOfInterest: string | null = null;
    private _daLayerAddedEvent = new Event('DALayerAdded');
    // @ts-ignore
    mapControls: MapControls | null = null;
    // @ts-ignore
    currentMapInteraction = null;
    // leftDrawerRef: any
    mapExtent: Array<number> = [
        7031250.271849444,
        2217134.3474655207,
        8415677.728150556,
        4922393.652534479
    ]
    isInit: Boolean = false;
    public readonly api: MapApi;
    private readonly isDesigner: boolean;
    private readonly fullScreen: FullScreen;
    legendPanel: any = null;
    selectionLayer: SelectionLayer
    mapInfo: IMapInfo | null = null;
    additionalToolbarButtons: JSX.Element[] = []

    constructor(domRef: IDomRef, isDesigner: boolean) {
        this._domRef = domRef
        this.isDesigner = isDesigner
        this.api = new MapApi(domRef.snackBarRef)
        this.fullScreen = new FullScreen({source: 'fullscreen'})
        this.fullScreen.on('enterfullscreen', this.handleFullScreen.bind(this))
        this.fullScreen.on('leavefullscreen', this.handleFullScreen.bind(this))
        this.mapControls = new MapControls(this);
        autoBind(this)

    }

    handleFullScreen() {
        this.getMapPanelRef().current?.closeBottomDrawer();
    }

    setDomRef(domRef: IDomRef) {
        this._domRef = domRef
    }

    initMap(mapInfo?: IMapInfo) {
        this.mapInfo = mapInfo
        this.map = new Map({
            controls: defaultControls().extend([
                this.fullScreen,
                new MapToolbar({
                    mapVM: this,
                    isDesigner: this.isDesigner,
                    isCreateMap: ((!this.isDesigner && !mapInfo) || mapInfo?.isEditor)
                })
            ]),
            view: new View({
                center: [7723464, 3569764],
                zoom: 5
            }),
        });
        let baseLayer = null;
        const weatherLayerInfos: any[] = []
        if (mapInfo) {
            if ("extent" in mapInfo) this.mapExtent = mapInfo.extent;

            mapInfo?.layers?.forEach(async (layer, index) => {
                if (layer.uuid != "-1")
                    await this.addDALayer(layer, index)
                else if (layer.isBase) {
                    baseLayer = layer.key
                } else {
                    const weatherLayerIndex = weatherLayers.findIndex((l) => l.layer_name == layer.key)
                    if (weatherLayerIndex !== -1) {
                        weatherLayerInfos.push(weatherLayers[weatherLayerIndex])

                    }
                }
            });

        }

        new BaseLayers(this).addBaseLayers(baseLayer)
        this.addSidebarController();
        this.isInit = true;
        this.selectionLayer = new SelectionLayer(this)
        this.addLegendControlToMap()
        weatherLayerInfos.forEach((info) => this.addWeatherLayer(info))

    }

    addWeatherLayer(selectedWeatherOption: any) {
        const wLayers = new WeatherLayers(this)
        if (selectedWeatherOption.layer_name === "weather_data") {
            wLayers.getWeatherData(selectedWeatherOption.layer_name)
        } else {
            wLayers.addTileWeatherMap(selectedWeatherOption)
        }
    }


    addLegendControlToMap() {
        // Define a new legend
        this.legendPanel = new ol_legend_Legend({
            title: 'Legend',
            margin: 5,
            padding: 10,
            maxHeight: 150,
            //maxWidth: 100
        });
        let legendCtrl = new Legend({
            legend: this.legendPanel,
            // collapsed: true
        });
        //@ts-ignore
        this.map.addControl(legendCtrl);
    }

    isLegendItemExist(legend: any, title: string) {
        let items = legend?.getItems()?.getArray() || [];
        for (let i = 0; i < items.length; i++) {
            if (items[i].get('title') === title) {
                return true;
            }
        }
        return false;
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

    getMapLoadingRef(): RefObject<DAMapLoading> {
        return this._domRef.loadingRef;
    }

    setTimeSliderRef(timeSliderRef: RefObject<TimeSlider>) {
        this._domRef.timeSliderRef = timeSliderRef
    }

    getTimeSliderRef(): RefObject<TimeSlider> {
        return this._domRef.timeSliderRef;
    }

    getRightDrawerRef(): RefObject<RightDrawer> {
        return this._domRef.rightDrawerRef
    }

    getLeftDrawerRef(): RefObject<LeftDrawer> {
        return this._domRef.leftDrawerRef
    }

    setAttributeTableRef(ref: RefObject<AttributeGrid>) {
        this._domRef.attributeTableRef = ref
    }

    getAttributeTableRef(): RefObject<AttributeGrid> {
        return this._domRef.attributeTableRef;
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

    getMapUUID(): string {
        if (this.mapInfo) {
            return this.mapInfo?.uuid
        } else {
            this.showSnackbar("Please save map before proceeding")
            return "-1"
        }
    }

    isMapEditor(): boolean {
        return this.mapInfo?.isEditor
    }

    setLayerOfInterest(uuid: string, closeDrawer: boolean = true) {
        this._layerOfInterest = uuid;
        setTimeout(() => {
            const sel: HTMLSelectElement = document.getElementById("loi-select") as HTMLSelectElement
            if (sel) {
                sel.selectedIndex = [...sel.options].findIndex(option => option.value == uuid)
            }
        }, 1000)

        const mapBoxRef = this.getMapPanelRef();
        let open = mapBoxRef.current?.isBottomDrawerOpen();
        if (open && closeDrawer) {
            mapBoxRef.current?.closeBottomDrawer()
        }
    }

    isLayerExist(uuid: string) {
        // const k: string[] = Object.keys(this.daLayers)
        for (let key in this.daLayers) {
            if (key == uuid)
                return true
        }
        return false
    }


    addSidebarController() {
        // let sidebarElem: HTMLElement = document.querySelector('.sidebar');
        // sidebarElem.style.display = "block";
        // let sidebar: Sidebar = new Sidebar({element: 'sidebar', position: 'right'});
        // this.getMap().addControl(sidebar);
    }

    setTarget(target: string) {
        this.map.setTarget(target);
        this.zoomToFullExtent()
        setTimeout(() => this.map.updateSize(), 2000);

    }

    refreshMap(clearFeatures: boolean = false) {
        setTimeout(() => {
            // this.map?.render()
            // this.map?.updateSize()
            // this.map?.setSize(this.map.getSize())
            // this.map?.updateSize()
            this.showSnackbar("Refreshing map...")
            Object.keys(this.daLayers).forEach((key) => {
                this.daLayers[key].refreshLayer(clearFeatures)
            });
        }, 100);
    }

    getMap(): Map {
        return this.map;
    }

    zoomToFullExtent() {
        // const extent = [7031250.271849444, 2217134.3474655207, 8415677.728150556, 4922393.652534479]
        // @ts-ignore
        this.mapExtent && this.map.getView().fit(this.mapExtent, this.map.getSize());
    }

    zoomToExtent(extent: number[]) {
        // @ts-ignore
        this.map.getView().fit(extent, this.map.getSize());
    }

    getCurrentExtent() {
        return this.map.getView().calculateExtent(this.map.getSize())
    }

    getExtent() {
        return this.mapExtent ? this.mapExtent : this.getCurrentExtent()
    }


    identifyFeature(target: HTMLElement) {
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
        let source = this.selectionLayer.getSource();
        if (this.currentMapInteraction !== null) {
            this.map.removeInteraction(this.currentMapInteraction);
        }
        this.currentMapInteraction = new Draw({
            source: source,
            type: drawType,
        });
        this.map.addInteraction(this.currentMapInteraction);
        // @ts-ignore
        this.currentMapInteraction.on('drawstart', () => {
            // console.log("draw start...")
            source.clear();
        });
        // @ts-ignore
        this.currentMapInteraction.on('drawend', function (e) {
            // console.log("draw start...")
            me.mapControls.getRasterAreaFromPolygon(me, target, e.feature);
        });
    }


    // getSelectionLayer(): VectorLayer<VectorSource> {
    //     // @ts-ignore
    //     return this.overlayLayers["sel_layer"]
    // }

    getOverlayLayer(layer_name: string): VectorLayer<VectorSource> {
        // @ts-ignore
        return this.overlayLayers[layer_name]
    }

    // @ts-ignore

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
    addOverlayLayer(layer: any, title: any = null, key: any = null) {
        if (title) {
            layer.set('title', title)
        }
        if (!key)
            key = MapVM.generateUUID()
        layer.set('name', key);
        if (typeof layer?.setAttributions === "function") {
            layer.setAttributions(`Digital Arz Layer ${layer.get('title')}`)
        }
        if (!(key in this.overlayLayers)) {
            this.overlayLayers[key] = layer
            this.map.addLayer(layer)
        }
    }

    getOverlayLayerUUID(lyr: any) {
        return lyr.get('name')
    }

    isOverlayLayerExist(uuid: string) {
        return (uuid in this.overlayLayers);
    }

    removeOverlayLayer(uuid: string) {
        if (uuid in this.overlayLayers) {
            const lyr = this.overlayLayers[uuid];
            this.map.removeLayer(lyr);
            delete this.overlayLayers[uuid];
        }
    }

    // addInterpolationSurface(title: string, data: IGeoJSON, fieldName: string, aoi: IGeoJSON = null) {
    //     const uuid = MapVM.generateUUID();
    //     this.daLayers[uuid] = new IDWLayer(uuid, title, data, fieldName, aoi)
    // }
    //
    // updateIDWLayer(propertyName: string) {
    //     if (this.interpolationLayer) {
    //         this.mapVM.getMap().removeLayer(this.interpolationLayer)
    //     }
    //     this.createIDWLayer(propertyName)
    //     this.addIDWLayer()
    // }

    async addDALayer(info: {
        uuid: string,
        style?: IFeatureStyle,
        visible?: boolean,
        zoomRange?: [number, number]
        opacity?: number
    }, index: number = 0) {
        const {uuid, style, zoomRange} = info
        if (!(uuid in this.daLayers)) {
            this.getMapLoadingRef()?.current?.openIsLoading()
            const payload: ILayerInfo = await this.api.get(MapAPIs.DCH_LAYER_INFO, {uuid: uuid})
            if (payload) {
                payload.zIndex = index
                if (style)
                    payload.style = style
                if (zoomRange)
                    payload.zoomRange = zoomRange
                let daLayer: AbstractDALayer;
                this._domRef.snackBarRef.current.show(`Adding ${payload.title} Layer`)
                if (payload?.dataModel === 'V') {
                    daLayer = new MVTLayer(payload, this);
                    this.daLayers[payload.uuid] = daLayer
                } else {
                    daLayer = new RasterTileLayer(payload, this)
                    this.daLayers[payload.uuid] = daLayer
                }
                const visible = info.visible != undefined ? info.visible : true
                const opacity = info?.opacity != undefined ? info.opacity : 1
                const olLayer = daLayer.getOlLayer()
                olLayer.setVisible(visible)
                olLayer.setOpacity(opacity)
                window.dispatchEvent(this._daLayerAddedEvent)
                setTimeout(() => olLayer.setZIndex(index), 3000)
            }
            this.getMapLoadingRef()?.current?.closeIsLoading()
        }
    }

    getDALayer(layerId: string | undefined): AbstractDALayer {
        if (layerId)
            return this.daLayers[layerId]
    }

    showSnackbar(msg: string, duration: number = 6000) {
        this._domRef.snackBarRef.current.show(msg, null, duration,)
    }

    drawPolygonForRasterArea(target: HTMLElement) {

        this.addDrawInteraction("Polygon", target);
    }

    static generateUUID() { // Public Domain/MIT
        let d = new Date().getTime();//Timestamp
        let d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now() * 1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            let r = Math.random() * 16;//random number between 0 and 16
            if (d > 0) {//Use timestamp until depleted
                r = (d + r) % 16 | 0;
                d = Math.floor(d / 16);
            } else {//Use microseconds since page-load if supported
                r = (d2 + r) % 16 | 0;
                d2 = Math.floor(d2 / 16);
            }
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
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
    openBottomDrawer(tableHeight: number) {
        const mapBoxRef = this.getMapPanelRef()
        if (!mapBoxRef.current.isBottomDrawerOpen()) {
            const mapHeight = mapBoxRef.current.getMapHeight();
            const maxMapHeight = mapBoxRef?.current?.getMaxMapHeight() || 300
            // console.log("map height", mapHeight, maxMapHeight);
            tableHeight = mapHeight <= maxMapHeight ? tableHeight : mapHeight / 2
            // console.log("table height", tableHeight)
            mapBoxRef.current.openBottomDrawer(tableHeight)

        }
        return tableHeight;
    }

    getAdditionalToolbarButtons() {
        return this.additionalToolbarButtons
    }

    addAdditionalToolbarButton(elem: JSX.Element) {
        this.additionalToolbarButtons.push(elem)
    }


    openLayerSwitcher() {
        const drawerRef = this.getRightDrawerRef();
        drawerRef?.current?.addContents("Table of Content", <LayerSwitcherPaper mapVM={this}/>)
        drawerRef?.current?.openDrawer()
        // props.drawerRef?.current?.addHeading()
        // this.refreshMap();
    }

    removeDALayer(uuid: string) {
        delete (this.daLayers[uuid])
    }

    getSelectionLayer() {
        return this.selectionLayer
    }

    createAttributeTable(columns: Column[], rows: Row[], pkCols: string[], tableHeight: number = 300, daGridRef: RefObject<AttributeGrid> = null, pivotTableSrc: string = null) {
        const mapBoxRef = this.getMapPanelRef()
        this.openBottomDrawer(tableHeight)
        const table = <AttributeGrid ref={daGridRef} columns={columns}
                                     data={rows}
                                     pkCols={pkCols}
                                     tableHeight={tableHeight}
                                     tableWidth={'auto'}
                                     pivotTableSrc={pivotTableSrc}
                                     mapVM={this}/>


        mapBoxRef.current?.setContent(table);
    }

    openAttributeTable(tableHeight = 300) {
        const mapPanelRef = this.getMapPanelRef()
        const daGridRef = this.getAttributeTableRef()
        let open = mapPanelRef.current?.isBottomDrawerOpen();
        const uuid = this.getLayerOfInterest();
        if (!uuid) {
            this.showSnackbar("Please select a layer to view its attributes");
        } else if (!open) {
            const mapHeight = mapPanelRef.current.getMapHeight()
            const maxMapHeight: number = mapPanelRef.current.getMaxMapHeight();
            tableHeight = mapHeight <= maxMapHeight ? tableHeight : mapHeight / 2
            // console.log("map", mapHeight)
            // console.log("max map", maxMapHeight)
            // console.log("table height", tableHeight)
            mapPanelRef.current?.openBottomDrawer(tableHeight)
            if (uuid) {
                this.getApi().get(MapAPIs.DCH_LAYER_ATTRIBUTES, {uuid: uuid})
                    .then((payload) => {
                        if (payload) {
                            // const ptSrc: string = "http://127.0.0.1:8000/api/lbdc/crop_stats_pivotTable/070df2ba-ea05-11ed-8338-acde48001122/";
                            this.createAttributeTable(payload.columns, payload.rows,
                                payload.pkCols, tableHeight, daGridRef)


                        } else {
                            mapPanelRef.current?.closeBottomDrawer()
                            this.getSnackbarRef()?.current?.show("No attribute found")
                        }
                    })
                    .catch(() => {
                        mapPanelRef.current?.closeBottomDrawer()
                        this.getSnackbarRef()?.current?.show("No attribute found")
                    });
            }
        } else {
            mapPanelRef.current?.closeBottomDrawer()
        }
    }
}

export default MapVM;
