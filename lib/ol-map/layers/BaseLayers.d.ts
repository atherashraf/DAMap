import MapVM from "../models/MapVM";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { BingMaps } from "ol/source";
import { ILayerSourcesInfo } from "../TypeDeclaration";
declare class BaseLayers {
    private mapVM;
    private readonly layersSources;
    constructor(mapVM: MapVM);
    addBaseLayers(): void;
    getLayer(key: string): any;
    getOSMLLayer(info: ILayerSourcesInfo): TileLayer<OSM>;
    getBingMapLayer(info: ILayerSourcesInfo): TileLayer<BingMaps>;
}
export default BaseLayers;
