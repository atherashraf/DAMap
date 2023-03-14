import AbstractDALayer from "./AbstractDALayer";
import XYZ from 'ol/source/XYZ';
declare class RasterTileLayer extends AbstractDALayer {
    setLayer(): void;
    setDataSource(): XYZ;
}
export default RasterTileLayer;
