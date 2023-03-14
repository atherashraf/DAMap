import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { BingMaps } from "ol/source";
import { Group } from "ol/layer";
class BaseLayers {
    constructor(mapVM) {
        this.mapVM = mapVM;
        this.layersSources = {
            osm: { title: "Open Street Map", source: "osm", visible: false },
            bingRoad: { title: "Bing Roads", source: "osm", visible: false, imagerySet: 'RoadOnDemand' },
            // bingAerial: {title: "Bing Aerial", source: "bing", visible: false, imagerySet: 'Aerial'},
            bingAerialLabel: {
                title: "Bing Aerial",
                source: "bing",
                visible: true,
                imagerySet: 'AerialWithLabelsOnDemand'
            },
            bingDark: { title: "Bing Dark Canvas", source: "bing", visible: false, imagerySet: 'CanvasDark' },
            // bingSurvey: {title: "Bing Ordnance Survey", source: "bing", visible: false, imagerySet: 'OrdnanceSurvey'},
        };
    }
    addBaseLayers() {
        const layers = [];
        for (let key in this.layersSources) {
            layers.push(this.getLayer(key));
        }
        const gLayer = new Group({
            //@ts-ignore
            title: 'Base Layers',
            openInLayerSwitcher: true,
            layers: layers
        });
        this.mapVM.getMap().addLayer(gLayer);
    }
    getLayer(key) {
        const info = this.layersSources[key];
        let layer;
        switch (info === null || info === void 0 ? void 0 : info.source) {
            case "osm":
                layer = this.getOSMLLayer(info);
                break;
            case "bing":
                layer = this.getBingMapLayer(info);
                break;
            default:
                break;
        }
        return layer;
    }
    getOSMLLayer(info) {
        return new TileLayer({
            //@ts-ignore
            title: info.title,
            visible: info.visible,
            // @ts-ignore
            baseLayer: true,
            source: new OSM({
                wrapX: false,
            }),
        });
    }
    getBingMapLayer(info) {
        return new TileLayer({
            //@ts-ignore
            title: info.title,
            visible: info.visible,
            preload: Infinity,
            // @ts-ignore
            baseLayer: true,
            source: new BingMaps({
                key: 'VVIQpQ8x3kIlljZrkYFr~Xc04jVHyjiW9rZ7F1rtCdw~Ah1DK8585DXN-dhn2zmHNIKEvjn25a8AyUpYIOxDGcS2ML_XnHQTL-eF_IhMdKn4',
                imagerySet: info.imagerySet,
                // use maxZoom 19 to see stretched tiles instead of the BingMaps
                // "no photos at this zoom level" tiles
                maxZoom: 19
            }),
        });
    }
}
export default BaseLayers;
