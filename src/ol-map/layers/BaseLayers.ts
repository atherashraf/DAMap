import MapVM from "../models/MapVM";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import {BingMaps} from "ol/source";
import {Group} from "ol/layer";
import {ILayerSources, ILayerSourcesInfo} from "../TypeDeclaration";



class BaseLayers {
    private mapVM: MapVM;
    private readonly layersSources: ILayerSources;
    private attributions =
        '<a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>';
    constructor(mapVM: MapVM) {
        this.mapVM = mapVM;
        this.layersSources = {
            osm: {title: "Open Street Map", source: "osm", visible: false},
            bingRoad: {title: "Bing Roads", source: "osm", visible: false, imagerySet: 'RoadOnDemand'},
            // bingAerial: {title: "Bing Aerial", source: "bing", visible: false, imagerySet: 'Aerial'},
            bingAerialLabel: {
                title: "Bing Aerial",
                source: "bing",
                visible: true,
                imagerySet: 'AerialWithLabelsOnDemand'
            },
            bingDark: {title: "Bing Dark Canvas", source: "bing", visible: false, imagerySet: 'CanvasDark'},
            // bingSurvey: {title: "Bing Ordnance Survey", source: "bing", visible: false, imagerySet: 'OrdnanceSurvey'},
        }
    }

    addBaseLayers() {
        const layers = []
        for (let key in this.layersSources) {
            layers.push(this.getLayer(key))
        }
        const gLayer = new Group({
            //@ts-ignore
            title: 'Base Layers',
            openInLayerSwitcher: true,
            layers: layers
        });
        this.mapVM.getMap().addLayer(gLayer)
    }

    getLayer(key: string): any {
        const info = this.layersSources[key];
        let layer: any
        switch (info?.source) {
            case "osm":
                layer = this.getOSMLLayer(info)
                break;
            case "bing":
                layer = this.getBingMapLayer(info)
                break
            default:
                break
        }
        return layer
    }

    getOSMLLayer(info: ILayerSourcesInfo): TileLayer<OSM> {
        return new TileLayer({
            //@ts-ignore
            title: info.title,
            visible: info.visible,
            // @ts-ignore
            baseLayer: true,
            source: new OSM({
                attributions: "OSM Layer",
                wrapX: false,
            }),
        });
    }

    getBingMapLayer(info: ILayerSourcesInfo): TileLayer<BingMaps> {
        return new TileLayer({
            //@ts-ignore
            title: info.title,
            visible: info.visible,
            preload: Infinity,
            // @ts-ignore
            baseLayer: true,
            source: new BingMaps({
                key: process.env.REACT_APP_BING_KEY,
                imagerySet: info.imagerySet,
                // use maxZoom 19 to see stretched tiles instead of the BingMaps
                // "no photos at this zoom level" tiles
                maxZoom: 19
            }),
        })

    }

}

export default BaseLayers
