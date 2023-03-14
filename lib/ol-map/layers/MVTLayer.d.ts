import VectorTileSource from "ol/source/VectorTile";
import AbstractDALayer from "./AbstractDALayer";
import { Feature } from "ol";
/*****
 *  url format for MVT
 */
declare class MVTLayer extends AbstractDALayer {
    setLayer(): void;
    getDataSource(): VectorTileSource;
    setDataSource(): void;
    styleFunction(feature: Feature, resolution: number): import("ol/style/Style").default;
    getFeatures(): void;
}
export default MVTLayer;
