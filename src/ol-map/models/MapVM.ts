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
import Api, {APIs} from "../../Api";
import {RefObject} from "react";
import RightDrawer from "../components/drawers/RightDrawer";
import LeftDrawer from "../components/drawers/LeftDrawer";
import AbstractVectorLayer from "../layers/AbstractVectorLayer";
import {DAFeatureStyle, ILayerInfo, IMapInfo} from "../utils/TypeDeclaration";

export interface IDALayers {
    [key: string]: AbstractVectorLayer
}

class MapVM {
    map: Map = null
    daLayer: IDALayers = {}
    // leftDrawerRef: any
    mapExtent: number[] = [
        7031250.271849444,
        2217134.3474655207,
        8415677.728150556,
        4922393.652534479
    ]
    isInit: Boolean = false;

    initMap(info: IMapInfo | null, rightDrawerRef: RefObject<RightDrawer>, leftDrawerRef: RefObject<LeftDrawer>) {
        this.map = new Map({
            controls: defaultControls().extend([
                new FullScreen(),
                new MapToolbar({mapVM: this, rightDrawerRef: rightDrawerRef, leftDrawerRef: leftDrawerRef})
            ]),
            view: new View({
                center: [7723464, 3569764],
                zoom: 5
            }),
        });
        this.addBaseLayers()

        info && info.layers.forEach((layer) => {
            this.addVectorLayer(layer.uuid, layer.style, layer.visible)
        })

        this.addSidebarController();
        this.addLayerSwitcher()
        this.isInit = true;
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

    addLayerSwitcher() {
        this.map.addControl(
            new LayerSwitcher({
                // target:$(".layerSwitcher").get(0),
                // displayInLayerSwitcher: function (l) { return false; },
                show_progress: true,
                // extent: true,
                trash: true,
                // oninfo: function (l) { alert(l.get("title")); }
            })
        )
    }

    setTarget(target: string) {
        this.map.setTarget(target);
        setTimeout(() => this.map.updateSize(), 2000);

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


    addVectorLayer(uuid: string, style: DAFeatureStyle = null, visible = true) {
        Api.get(APIs.DCH_LAYER_INFO, {uuid: uuid})
            .then((payload: ILayerInfo) => {
                if (style)
                    payload["style"] = style
                const mvtLayer = new MVTLayer(payload, this);

                mvtLayer.getOlLayer().setVisible(visible)

                this.daLayer[payload.uuid] = mvtLayer
            })
    }


    getDALayer(layerId: string): AbstractVectorLayer {
        return this.daLayer[layerId]
    }
}

export default MapVM;
